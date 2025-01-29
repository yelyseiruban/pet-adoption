import {UserDBModel} from "../../../models/db/userDb";
import {UserResponse} from "../../../models/responses/userResponse";

class UserConverter {
    public static convertUser(user: UserDBModel): UserResponse {
        const { _id, __v, ...userData } = user.toObject ? user.toObject() : user;
        return {
            ...userData,
            id: _id,
            links: {
                self: `/users/user/${_id}`,
                pets: `/users/user/${_id}/pets`,
                verify: `/users/user/verify/${_id}`,
            },
        };
    }

    public static convertUsers(users: UserDBModel[]): UserResponse[] {
        return users.map(this.convertUser);
    }
}

export default UserConverter;