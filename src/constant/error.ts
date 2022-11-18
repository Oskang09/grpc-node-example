const UserInvalidPassword = "user.invalid_password";
const UserDuplicateEmail = "user.duplicate_email";
const UserNotFound = "user.not_found";
const RoleNotFound = "role.not_found";

export const ErrUserInvalidPassword = Error(UserInvalidPassword);
export const ErrUserDuplicateEmail = Error(UserDuplicateEmail);
export const ErrUserNotFound = Error(UserNotFound);
export const ErrRoleNotFound = Error(RoleNotFound);

export const ErrMapper: { [name: string]: string } = {
    [UserInvalidPassword]: "Invalid password",
    [UserDuplicateEmail]: "Email already exists",
    [UserNotFound]: "User doesn't exists",
    [RoleNotFound]: "Role doesn't exiss",
};