export type Actions =
| {type: 'login', user: any}
| {type: 'registrate', user: any}
| {type: 'logout'}
| {type: 'update', user: any}
;

export const logIn = (user:any ) => ({
    type: 'login',
    user,
});

export const logOut = () => ({
    type: 'logout',
});

export const registrate = (user: any) => ({
    type: 'registrate',
    user, 
});

export const update = (user: any) => ({
    type: 'update',
    user,
});