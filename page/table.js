import iDB from "../src/iDB.js";


class CashedAPI {
    constructor() {
        this.db = null;
    }

    async install() {
        try {
            this.db = new iDB("training_db");

            await this.db.connect();

            if (!this.db.hasStore("cache_control")) {
                await this.db.createStore("cache_control", {
                    keyPath: "prefix",
                });
            }

            if (!this.db.hasStore("FCTP")) {
                await this.db.createStore("FCTP", {
                    keyPath: "uid",
                });
            }

            if (!this.db.hasStore("FCFC")) {
                await this.db.createStore("FCFC", {
                    keyPath: "uid",
                });
            }

            return this.db;
        } catch (err) {
            throw new Error("Failed to install CashedAPI");
        }
    }

    async uninstall() {
        try {
            return await this.db.uninstall();
        } catch (err) {
            throw new Error("Failed to uninstall CashedAPI");
        }
    }

    async apiCallByPrefix(prefix) {
        try {
            if (prefix === "FCTP") {
                return await axios.get(`http://localhost/training/facility/code.php`);
            } else if (prefix === "FCFC") {
                return await axios.get(`http://localhost/training/facility/facility.php`);
            }
        } catch (err) {
            throw new Error("Failed to call API");
        }
    }

    async checkCacheControl() {
        const refreshFunction = async (prefix) => {
            try {
                const data = (await this.apiCallByPrefix(prefix)).data;

                await this.db.clear(prefix);
                await this.db.puts(prefix, data);

                return data;
            } catch (err) {
                throw new Error("Failed to refresh cache");
            }
        };

        const checkFunction = async (record) => {
            try {
                const prefix = record[0];
                const server_uuid = record[1];

                const cached_uuid = (await this.db.get("cache_control", prefix))?.uuid;

                if (cached_uuid === undefined || cached_uuid !== server_uuid) {
                    await this.db.put("cache_control", {
                        prefix: prefix,
                        uuid: server_uuid
                    });

                    return refreshFunction(prefix);
                } else {
                    return;
                }
            } catch (err) {
                throw new Error("Failed to check cache control");
            }
        };

        try {
            const response = await axios.get("http://localhost/training/utility/cachecontrol.php");

            return await Promise.allSettled(
                Object.entries(response.data).map(checkFunction)
            );
        } catch (err) {
            throw new Error("Failed to check cache control");
        }
    };

    async getAll(prefix) {
        return await this.db.getAll(prefix);
    }
}

const page = {
    "path": "/table",
    "component": {
        "template": `
            <v-container>
                <table class="table">
                    <thead>
                        <tr>
                            <th class="text-left">Code</th>
                            <th class="text-left">Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="code in codes">
                            <td>{{ code.facility_id }}</td>
                            <td>{{ code.name }}</td>
                        </tr>
                    </tbody>
                </table>
            </v-container>
            `,
        data() {
            return {
                api: null,
                codes: [],
            }
        },
        methods: {
        },
        async mounted() {
            this.api = new CashedAPI();
            await this.api.install();

            await this.api.checkCacheControl();

            // this.codes = await this.api.getAll("FCTP");

            this.codes = await this.api.getAll("FCFC");

            // this.api.uninstall();
        }
    }
};

export default page; 1