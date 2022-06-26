import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Actions from "store/actions";

const Logout = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(Actions.auth.Logout.request());
	}, [dispatch]);

	return null;
};

export default Logout;
