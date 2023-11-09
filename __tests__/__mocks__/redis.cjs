module.exports = {
	createClient() {
		return {
			__data: {},
			get data() {
				return this.__data;
			},
			set data(data) {
				this.__data = data;
			},
			on() {},
			get(key) {
				return this.data[key];
			},
			set(key, value) {
                this.data[key] = value;
            },
			incrByFloat(key, value) {
				if (this.data[key]) {
					this.data[key] += value;
				} else {
					this.data[key] = value;
				}
			},
		};
	},
};
