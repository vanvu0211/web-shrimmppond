import * as Pages from "../pages"
import { paths } from "../config"

const routes = [
//ứng với mỗi phần tử là 1 link
    {
        path: paths.dashboard, //đường link
        component: Pages.Dashboard, //dữ liệu

    },
    {
        path: paths.evista, //đường link
        component: Pages.Evista, //dữ liệu

    },
    {
        path: paths.status, //đường link
        component: Pages.Status, //dữ liệu

    },
    {
        path: paths.food, //đường link
        component: Pages.Food, //dữ liệu

    },
    {
        path: paths.account, //đường link
        component: Pages.Account, //dữ liệu

    },
    {
        path: paths.move, //đường link
        component: Pages.Move, //dữ liệu

    },
    {
        path: paths.harvest, //đường link
        component: Pages.Harvest, //dữ liệu

    },
    {
        path: paths.access, //đường link
        component: Pages.Access, //dữ liệu

    },
]

export default routes