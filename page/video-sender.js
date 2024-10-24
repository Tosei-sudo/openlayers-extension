
const page = {
    "path": "/video-sender",
    "component": {
        "template": `
            <div>
                <v-btn @click="test()">Test</v-btn>


                <div class="p-3">
                    <textarea v-model="offerStr" class="form-control input-mn" readonly></textarea>
                </div>

                <div class="p-3">
                    <textarea v-model="answerStr" class="form-control input-mn"></textarea>
                </div>

                <div class="p-3">
                    <textarea v-model="candidatesStr" class="form-control input-mn" readonly></textarea>
                </div>

                <div class="p-3">
                    <textarea v-model="receiverCandidatesStr" class="form-control input-mn"></textarea>
                </div>

            </div>
            `,
        data() {
            return {
                el: null,
                isRunning: false,
                candidates: [],
                offer: null,
                connection: null,
                channel: null,
                localStream: null,
                receivedMessages: [],
                channelOpen: false,
                useMedia: false,
                answerStr: "",
                receiverCandidatesStr: "",
            }
        },
        watch: {
            answerStr(answer) {
                //アンサーを受け取ったらそれをリモートのSDPとして登録
                this.connection.setRemoteDescription(JSON.parse(answer))
            },
            receiverCandidatesStr(str) {
                //ICE Candidatesを受け取る
                const candidates = JSON.parse(str)
                //それぞれのCandidateをブラウザのICEエージェントに渡す。
                candidates.forEach(candidate => {
                    console.log('Sender adding candidate', candidate)
                    this.connection.addIceCandidate(candidate).catch((e) => {
                        console.eror('Sender addIceCandidate error', e)
                    })
                })
            },
        },
        computed: {
            offerStr() {
                return JSON.stringify(this.offer)
            },
            candidatesStr() {
                return JSON.stringify(this.candidates)
            }
        },
        methods: {
            async sendDataToServer() {
                const config = {
                    offerToReceiveAudio: 1,
                    offerToReceiveVideo: 0,
                }

                this.connection = new RTCPeerConnection(config)

                // データチャンネルの生成とイベントハンドラの登録
                // それぞれ、表示用の変数に追加、代入する
                this.channel = this.connection.createDataChannel("channel")
                this.channel.onmessage = e => { this.receivedMessages.push(e.data) }
                this.channel.onopen = e => { this.channelOpen = true }
                this.channel.onclose = e => { this.channelOpen = false }

                // ICE Candidatesが生成された時発火するイベントハンドラ
                // setLocalDescription(sdp)が呼ばれるとICE Candidatesの生成が裏で行われて発火する
                // Receiver側にICE Candidatesの情報を渡す必要があるので
                // this.candidates 変数にpushしてテキストボックスに表示する
                this.connection.onicecandidate = e => {
                    if (e.candidate) {
                        this.candidates.push(e.candidate)
                    }
                }

                // ユーザがビデオを許可している時のみ、MediaStreamTrackを登録する
                // Sender側の画面でもビデオを使っている事が見えるようにする必要があるので
                // this.localStream 変数にメディアストリームを代入
                try {
                    const displayMediaOptions = {
                        video: {
                            displaySurface: "browser",
                        },
                        audio: {
                            suppressLocalAudioPlayback: false,
                        },
                        preferCurrentTab: false,
                        selfBrowserSurface: "exclude",
                        systemAudio: "include",
                        surfaceSwitching: "include",
                        monitorTypeSurfaces: "include",
                    };

                    this.localStream = await this.startCapture(displayMediaOptions);
                    this.localStream.getTracks().forEach(track => this.connection.addTrack(track, this.localStream))
                    this.useMedia = true
                } catch {
                    this.localStream = undefined
                }

                // config、データチャンネル、メディアストリーム情報を元にしたSDPを作成し、自身のSDPとして登録。
                // 裏でICE Candidatesが作成されるので、自身の onicecandidate が発火される
                this.connection.createOffer().then(offerSDP => {
                    this.connection.setLocalDescription(offerSDP)
                    // 作成したSDPはReceiver側に渡す必要があるので this.offer 変数に代入
                    this.offer = offerSDP
                })
                console.log('接続準備完了')
            },

            async startCapture(displayMediaOptions) {
                let captureStream = null;

                try {
                    captureStream =
                        await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
                } catch (err) {
                    console.error(`Error: ${err}`);
                }
                return captureStream;
            },

            test() {
                this.sendDataToServer();
            }
        },
        mounted() {
            this.el = document.getElementById("video");
        }
    }
};

export default page;