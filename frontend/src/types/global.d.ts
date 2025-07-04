export interface User {
	_id : string,
	name : string,
	email : string,
	role? : string,
	avatar_url : string,
}

export interface UserRegister {
	name : string,
	email : string,
	password : string,
}