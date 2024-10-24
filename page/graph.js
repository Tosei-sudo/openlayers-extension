
const page = {
    "path": "/graph",
    "component": {
        "template": `
            <div>
                <line-chart :data="data" />
                <v-color-picker v-model="color"></v-color-picker>

                <div class="p-3">
                    <textarea :value="receiverStr" class="form-control input-mn" readonly></textarea>
                </div>

                <div class="p-3">
                    <textarea :value="receiverCandidatesStr" class="form-control input-mn" readonly></textarea>
                </div>
            </div>
            `,
        data() {
            return {
                chart: null,
                data: [
                    {
                        color: 'red',
                        key: 'hoge',
                        values: [],
                        area: true
                    }
                ],
                receiverStr: `{"sdp":"v=0\r\no=- 3446128990132868545 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0 1\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS 68271dd6-3889-4ddf-9ff8-1df176a5d502\r\nm=video 9 UDP/TLS/RTP/SAVPF 96 97 102 103 104 105 106 107 108 109 127 125 39 40 45 46 98 99 100 101 112 113 116 117 118\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:+aI0\r\na=ice-pwd:oWgxZLSnZ4MLTGhMYWE64CDs\r\na=ice-options:trickle\r\na=fingerprint:sha-256 FE:9E:8C:0B:CB:D6:D1:E0:57:44:D8:68:27:7C:F3:47:81:7A:E2:7D:66:3D:36:97:35:E2:90:DB:0C:43:02:27\r\na=setup:actpass\r\na=mid:0\r\na=extmap:1 urn:ietf:params:rtp-hdrext:toffset\r\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=extmap:3 urn:3gpp:video-orientation\r\na=extmap:4 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\na=extmap:5 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay\r\na=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type\r\na=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-timing\r\na=extmap:8 http://www.webrtc.org/experiments/rtp-hdrext/color-space\r\na=extmap:9 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=extmap:10 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\r\na=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\r\na=sendrecv\r\na=msid:68271dd6-3889-4ddf-9ff8-1df176a5d502 6397e66f-9046-4f1c-ac67-5584dcdfe2ea\r\na=rtcp-mux\r\na=rtcp-rsize\r\na=rtpmap:96 VP8/90000\r\na=rtcp-fb:96 goog-remb\r\na=rtcp-fb:96 transport-cc\r\na=rtcp-fb:96 ccm fir\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtpmap:97 rtx/90000\r\na=fmtp:97 apt=96\r\na=rtpmap:102 H264/90000\r\na=rtcp-fb:102 goog-remb\r\na=rtcp-fb:102 transport-cc\r\na=rtcp-fb:102 ccm fir\r\na=rtcp-fb:102 nack\r\na=rtcp-fb:102 nack pli\r\na=fmtp:102 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42001f\r\na=rtpmap:103 rtx/90000\r\na=fmtp:103 apt=102\r\na=rtpmap:104 H264/90000\r\na=rtcp-fb:104 goog-remb\r\na=rtcp-fb:104 transport-cc\r\na=rtcp-fb:104 ccm fir\r\na=rtcp-fb:104 nack\r\na=rtcp-fb:104 nack pli\r\na=fmtp:104 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42001f\r\na=rtpmap:105 rtx/90000\r\na=fmtp:105 apt=104\r\na=rtpmap:106 H264/90000\r\na=rtcp-fb:106 goog-remb\r\na=rtcp-fb:106 transport-cc\r\na=rtcp-fb:106 ccm fir\r\na=rtcp-fb:106 nack\r\na=rtcp-fb:106 nack pli\r\na=fmtp:106 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\na=rtpmap:107 rtx/90000\r\na=fmtp:107 apt=106\r\na=rtpmap:108 H264/90000\r\na=rtcp-fb:108 goog-remb\r\na=rtcp-fb:108 transport-cc\r\na=rtcp-fb:108 ccm fir\r\na=rtcp-fb:108 nack\r\na=rtcp-fb:108 nack pli\r\na=fmtp:108 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42e01f\r\na=rtpmap:109 rtx/90000\r\na=fmtp:109 apt=108\r\na=rtpmap:127 H264/90000\r\na=rtcp-fb:127 goog-remb\r\na=rtcp-fb:127 transport-cc\r\na=rtcp-fb:127 ccm fir\r\na=rtcp-fb:127 nack\r\na=rtcp-fb:127 nack pli\r\na=fmtp:127 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=4d001f\r\na=rtpmap:125 rtx/90000\r\na=fmtp:125 apt=127\r\na=rtpmap:39 H264/90000\r\na=rtcp-fb:39 goog-remb\r\na=rtcp-fb:39 transport-cc\r\na=rtcp-fb:39 ccm fir\r\na=rtcp-fb:39 nack\r\na=rtcp-fb:39 nack pli\r\na=fmtp:39 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=4d001f\r\na=rtpmap:40 rtx/90000\r\na=fmtp:40 apt=39\r\na=rtpmap:45 AV1/90000\r\na=rtcp-fb:45 goog-remb\r\na=rtcp-fb:45 transport-cc\r\na=rtcp-fb:45 ccm fir\r\na=rtcp-fb:45 nack\r\na=rtcp-fb:45 nack pli\r\na=fmtp:45 level-idx=5;profile=0;tier=0\r\na=rtpmap:46 rtx/90000\r\na=fmtp:46 apt=45\r\na=rtpmap:98 VP9/90000\r\na=rtcp-fb:98 goog-remb\r\na=rtcp-fb:98 transport-cc\r\na=rtcp-fb:98 ccm fir\r\na=rtcp-fb:98 nack\r\na=rtcp-fb:98 nack pli\r\na=fmtp:98 profile-id=0\r\na=rtpmap:99 rtx/90000\r\na=fmtp:99 apt=98\r\na=rtpmap:100 VP9/90000\r\na=rtcp-fb:100 goog-remb\r\na=rtcp-fb:100 transport-cc\r\na=rtcp-fb:100 ccm fir\r\na=rtcp-fb:100 nack\r\na=rtcp-fb:100 nack pli\r\na=fmtp:100 profile-id=2\r\na=rtpmap:101 rtx/90000\r\na=fmtp:101 apt=100\r\na=rtpmap:112 H264/90000\r\na=rtcp-fb:112 goog-remb\r\na=rtcp-fb:112 transport-cc\r\na=rtcp-fb:112 ccm fir\r\na=rtcp-fb:112 nack\r\na=rtcp-fb:112 nack pli\r\na=fmtp:112 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=64001f\r\na=rtpmap:113 rtx/90000\r\na=fmtp:113 apt=112\r\na=rtpmap:116 red/90000\r\na=rtpmap:117 rtx/90000\r\na=fmtp:117 apt=116\r\na=rtpmap:118 ulpfec/90000\r\na=ssrc-group:FID 1207355045 2377913407\r\na=ssrc:1207355045 cname:BEUVDq+N0jqZtf1H\r\na=ssrc:1207355045 msid:68271dd6-3889-4ddf-9ff8-1df176a5d502 6397e66f-9046-4f1c-ac67-5584dcdfe2ea\r\na=ssrc:2377913407 cname:BEUVDq+N0jqZtf1H\r\na=ssrc:2377913407 msid:68271dd6-3889-4ddf-9ff8-1df176a5d502 6397e66f-9046-4f1c-ac67-5584dcdfe2ea\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:+aI0\r\na=ice-pwd:oWgxZLSnZ4MLTGhMYWE64CDs\r\na=ice-options:trickle\r\na=fingerprint:sha-256 FE:9E:8C:0B:CB:D6:D1:E0:57:44:D8:68:27:7C:F3:47:81:7A:E2:7D:66:3D:36:97:35:E2:90:DB:0C:43:02:27\r\na=setup:actpass\r\na=mid:1\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n","type":"offer"}`,
                receiverCandidatesStr: `[{"candidate":"candidate:1378760102 1 udp 2113937151 af5c44d2-3b1f-41b4-84e2-58c911d7adbd.local 55560 typ host generation 0 ufrag +aI0 network-cost 999","sdpMid":"0","sdpMLineIndex":0,"usernameFragment":"+aI0"},{"candidate":"candidate:1469698609 1 udp 2113939711 a9cfcb3d-e8c4-46cc-931f-cf429f1c4916.local 55561 typ host generation 0 ufrag +aI0 network-cost 999","sdpMid":"0","sdpMLineIndex":0,"usernameFragment":"+aI0"},{"candidate":"candidate:1378760102 1 udp 2113937151 af5c44d2-3b1f-41b4-84e2-58c911d7adbd.local 55562 typ host generation 0 ufrag +aI0 network-cost 999","sdpMid":"1","sdpMLineIndex":1,"usernameFragment":"+aI0"},{"candidate":"candidate:1469698609 1 udp 2113939711 a9cfcb3d-e8c4-46cc-931f-cf429f1c4916.local 55563 typ host generation 0 ufrag +aI0 network-cost 999","sdpMid":"1","sdpMLineIndex":1,"usernameFragment":"+aI0"}]`,
            }
        },
        methods: {
            // updateData() {
            //     let index = this.data[0].values.length;
            //     this.data[0].values.push({ x: index + 1, y: 150 * Math.random() });

            //     setTimeout(this.updateData, 500);
            // },
            // createChart() {
            //     this.updateData();
            // }
        },
        mounted() {
            const sinWave = d3.range(0, 2 * Math.PI, 0.01).map((d) => {
                return { x: d, y: Math.sin(d) * 100 + Math.cos(d * 2) * 100 + Math.sin(d * 4) * 100 + Math.cos(d * 8) * 100 };
            });

            this.data[0].values = sinWave;
        }
    }
};

export default page;