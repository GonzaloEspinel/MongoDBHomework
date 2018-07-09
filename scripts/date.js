var createDate = function() {
	var d = new Date();
	var goodDate = "";

	goodDate += (d.getMonth() + 1) + "_";

	goodDate += d.getDate() + "_";

	goodDate += d.getFullYear();

	return goodDate;
};

module.exports = createDate;