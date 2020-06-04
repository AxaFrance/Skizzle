const getDiffDays = strDate => {
	const date = new Date(strDate);
	const today = new Date();
	const oneDay = 24 * 60 * 60 * 1000;
	return Math.round(Math.abs((date.getTime() - today.getTime()) / oneDay));
};

export default getDiffDays;
