export default {
	required: {
		trigger: 'blur',
		required: true,
		message: "必填项！"
	},
	name() {
		var reg = /.*[\u4e00-\u9fa5]+.*$/; // 中文
		var msg = "应用名称不能为中文";
		return {
			trigger: "blur",
			validator: (rule, value, callback) => {
				if (value == "") {
					callback();
					return false;
				}
				if (reg.test(value)) {
					callback(new Error(msg));
					return false;
				}
				callback();
			}
		};
	},
	password() {
		var reg = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,16}/;
		var msg = "只能输入包含字母、数字、特殊字符，长度8-16位";
		return {
			trigger: "blur",
			validator: (rule, value, callback) => {
				if (value == "") {
					callback();
					return false;
				}
				if (!reg.test(value)) {
					callback(new Error(msg));
					return false;
				}
				callback();
			}
		};
	},
	peopleID() {
		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		var msg = "你的身份证格式不正确";
		return {
			trigger: "blur",
			validator: (rule, value, callback) => {
				if (value == "") {
					callback();
					return false;
				}
				if (!reg.test(value)) {
					callback(new Error(msg));
					return false;
				}
				callback();
			}
		};
	},
	email() {
		var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
		var msg = "请输入有效的邮箱";
		return {
			trigger: "blur",
			validator: (rule, value, callback) => {
				if (value == "") {
					callback();
					return false;
				}
				if (!reg.test(value)) {
					callback(new Error(msg));
					return false;
				}
				callback();
			}
		};
	},
	int(option) {
		var min = 0;
		var max = Infinity;
		if (option) {
			min = option.min || 0;
			max = option.max || Infinity;
		}
		var msg = "请填写正确的整数";
		var reg = /^-?[1-9]\d*$/;
		return {
			trigger: "blur",
			validator: (rule, value, callback) => {
				if (value == "") {
					callback();
					return false;
				}
				if (isNaN(value) || !reg.test(value)) {
					callback(new Error(msg));
					return false;
				}
				if (Number(value) > max) {
					callback(new Error("数值过大"));
					return false;
				}
				if (Number(value) < min) {
					callback(new Error("数值太小"));
					return false;
				}
				callback();
			}
		};
	},
	decimal(option) {
		var n = 0,
			m = "";
		if (option) {
			n = option.min || 0;
			m = option.max || "";
		}
		var reg = new RegExp(`^([1-9]\\d*|0)(\\.\\d{${n},${m}})?$`);
		var msg = "请填写正确的小数格式";
		return {
			trigger: "blur",
			validator: (rule, value, callback) => {
				if (value == "") {
					callback();
					return false;
				}
				if (!reg.test(value)) {
					callback(new Error(msg));
					return false;
				}
				callback();
			}
		};
	},
	length({
		min,
		max
	}) {
		var isMaxUndefined = max === undefined;
		var isMinUndefined = min === undefined;
		min = min || 0;
		max = max || 999;
		var msg = `长度不能小于${min}大于${max}个字符`;
		if (isMaxUndefined) {
			msg = `长度不能小于${min}个字符`;
		}
		if (isMinUndefined) {
			msg = `长度不能大于${max}个字符`;
		}
		return {
			min: min,
			max: max,
			message: msg,
			trigger: "blur"
		};
	},
	
};


