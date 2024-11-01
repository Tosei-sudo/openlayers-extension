
const page = {
    "path": "/video-receiver",
    "component": {
        "template": `
            <div>
                <div class="p-3">
                    <textarea v-model="offerStr" class="form-control input-mn"></textarea>
                </div>

                <div class="p-3">
                    <textarea v-model="answerStr" class="form-control input-mn" readonly></textarea>
                </div>

                <div class="p-3">
                    <textarea v-model="receiverCandidatesStr" class="form-control input-mn"></textarea>
                </div>

                <div class="p-3">
                    <textarea v-model="candidatesStr" class="form-control input-mn" readonly></textarea>
                </div>

                <div id="video-container">
                    <video id="video" autoplay></video>
                </div>
            </div>
            `,
        data() {
            return {
                el: null,
                isRunning: false,
                candidates: [],
                offer: null,
                offerStr: "",
                connection: null,
                channel: null,
                localStream: null,
                receivedMessages: [],
                channelOpen: false,
                useMedia: false,
                answer: null,
                receiverCandidatesStr: "",
            }
        },
        watch: {
            async offerStr(offer) {
                console.log(offer)
                //オファーを受け取ったらそれをリモートのSDPとして登録
                await this.connection.setRemoteDescription(JSON.parse(offer));
                //config,データチャネル、メディアストリーム情報を元にしたSDPを作成し、自身のSDPとして登録
                //裏でICE Candidatesが作成されるので、自身のonicecandidateが発火される
                this.answer = await this.connection.createAnswer();
                this.connection.setLocalDescription(this.answer);
            },
            receiverCandidatesStr(str) {
                //ICE Candidatesを受け取る
                const candidates = JSON.parse(str);
                //それぞれのCandidateをブラウザのICEエージェントに渡す
                candidates.forEach(candidate => {
                    console.log("Receiver adding candidate", candidate);
                    this.connection.addIceCandidate(candidate).catch(e => {
                        console.eror("Receiver addIceCandidate error", e);
                    });
                });
            }
        },
        computed: {
            answerStr() {
                return JSON.stringify(this.answer);
            },
            candidatesStr() {
                return JSON.stringify(this.candidates)
            }
        },
        methods: {
            async connectSetup() {
                const config = {
                    offerToReceiveAudio: 1,
                    offerToReceiveVideo: 0,
                };

                this.connection = new RTCPeerConnection(config);

                this.connection.ondatachannel = this.receiveChannelCallback;
                this.connection.ontrack = this.handleconnectionTrack;

                this.connection.onicecandidate = e => {
                    if (e.candidate) {
                        this.candidates.push(e.candidate);
                    }
                };

                console.log("onconnect");
            },

            receiveChannelCallback(e) {
                //データチャンネルの生成とイベントハンドラの登録
                this.channel = e.channel;
                this.channel.onmessage = this.handleMessage;
                this.channel.onopen = this.handlechannelStatusChange;
                this.channel.onclose = this.handlechannelStatusChange;
            },
            handleconnectionTrack(e) {
                //Sender側から来たメディアストリームをthis.mediaStreamに代入
                this.mediaStream = e.streams[0];

                this.el.srcObject = this.mediaStream;
            },
        },
        mounted() {
            this.el = document.getElementById("video");
            this.connectSetup();
        }
    }
};

export default page;