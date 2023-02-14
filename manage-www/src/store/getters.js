const getters = {
    token: state => state.user.token,
    licence: state => state.user.licence,
    username: state => state.user.username,
    level: state => state.user.level,
    routes: state => state.routes.routes,
    // routes: state => {
    //     return state.routes.routes.filter(route => {
    //         const level = parseInt(route.meta.level);
    //         const userLevel = parseInt(state.user.level);
    //         route.children && (route.children = route.children.filter(child => {
    //             return userLevel >= parseInt(child.meta.level);
    //         }));
    //         return userLevel >= level;
    //     });
    // },
    refresh: state => state.app.refresh,
    tags: state => state.routes.tags
};

export default getters;