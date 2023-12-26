import client from "../../configs/redisClient";

function Users(this: any) {
	this.client = client;
}

//@ts-ignore
export default new Users();

Users.prototype.upsert = function (connectionId: any, meta: { _id: any; }) {
	this.client.hset(
		'online',
		meta._id,
		JSON.stringify({
			connectionId,
			meta,
			when: Date.now()
		}),
        (		err: any) => {
			if (err) {
			  console.error(err);
			}
		}
	)
};

Users.prototype.remove = function (_id: any) {
	this.client.hdel(
		'online',
		_id,
        (		err: any) => {
			if (err) {
				console.error(err);
			}
		}
	);
};

Users.prototype.list = function (callback: (arg0: any[]) => any) {

	let active: any[] = [];

	this.client.hgetall('online', function (err: any, users: { [x: string]: string; }) {
		if (err) {
		  console.error(err);
		  return callback([]);
		}
		for (let user in users){
			active.push(JSON.parse(users[user]));
		}

		return callback(active);
	})
};