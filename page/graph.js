
const page = {
    "path": "/graph",
    "component": {
        "template": `
            <div id="calender"></div>
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
            }
        },
        methods: {
            createCalender() {
                const startDate = new Date();
                const endDate = new Date();
                startDate.setDate(startDate.getDate() - 1);

                endDate.setMinutes(endDate.getMinutes() + 30);

                const calendar = new FullCalendar.Calendar(document.getElementById("calender"), {
                    initialView: 'dayGridMonth',
                    // initialView: 'timeGridWeek',
                    // initialView: 'timeGridDay',
                    // initialView: 'listWeek',
                    height: "100vh",

                    events: [
                        { title: 'event 1', date: new Date() },
                        { title: 'event 2', start: '2024-10-28', end: endDate, url: "https://www.google.com" },
                        {
                            date: '2024-10-21T00:00:00',
                            title: "祝日",
                            display: 'background',
                            allDay: true,
                        }
                    ],
                    timeZone: 'Asia/Tokyo',
                    locale: 'ja',
                    headerToolbar: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                    },
                    nowIndicator: true,
                    navLinks: true,
                    firstDay: 1,
                    eventClick: function (info) {
                        info.jsEvent.preventDefault(); // don't let the browser navigate
                        if (info.event.url) {
                            window.open(info.event.url);
                        }
                        console.log(info);
                    },
                    fixedWeekCount: false,
                });
                // get timezone
                console.log(calendar.getOption('timeZone'));
                calendar.render();
            },
        },
        mounted() {
            const sinWave = d3.range(0, 2 * Math.PI, 0.01).map((d) => {
                return { x: d, y: Math.sin(d) * 100 + Math.cos(d * 2) * 100 + Math.sin(d * 4) * 100 + Math.cos(d * 8) * 100 };
            });

            this.data[0].values = sinWave;

            this.createCalender();
        }
    }
};

export default page;