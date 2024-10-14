
const page = {
    "path": "/graph",
    "component": {
        "template": `
            <div>
                <line-chart :data="data" />
            </div>
            `,
        data() {
            return {
                chart: null,
                data: [
                    {
                        color: 'red',
                        key: 'hoge',
                        values: [
                            { x: 1, y: 100 },
                            { x: 2, y: 130 },
                            { x: 3, y: 90 },
                        ]
                    }
                ]
            }
        },
        methods: {
            updateData() {
                let index = this.data[0].values.length;
                this.data[0].values.push({ x: index + 1, y: 150 * Math.random() });

                setTimeout(this.updateData, 500);
            },
            createChart() {
                this.updateData();
            }
        },
        mounted() {
            this.createChart();
        }
    }
};

export default page;