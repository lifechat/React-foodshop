

import React,{Suspense,lazy} from 'react'

import { unstable_HistoryRouter as HistoryRouter, useParams, useRoutes, useLocation } from 'react-router-dom'

import {createBrowserHistory} from 'history'

import SpinLoading from 'antd-mobile/es/components/spin-loading'

/**
 *  路由配置
 */
const routeConfig = [
    { 
      path: '/', 
      component: lazy(() => import('../pages/ScreenHome')), 
      pageName: 'Home'
    },
    {
        path:'/register',
        component:lazy(() => import('../pages/ScreenRegister')),
        pageName:'register'
    },
    {
        path:'/openScreen/:id',
        component:lazy(()=> import('../pages/ScreenOpenning')),
        pageName:'Screen'
    },
    // cesium
    {
        path:'/cesiumScreen',
        component:lazy(()=> import('../pages/ScreenCesium')),
        pageName:'Cesium'
    },
    // three.js
    {
        path:'/threeScreen',
        component:lazy(()=> import('../pages/ScreenThree')),
        pageName:'three'
    },
    {
        path:'/inviteScreen',
        component:lazy(() => import('../pages/ScreenInvitation/InviteRank')),
        pageName:'inviteRank'
    },
    {
        path:'/dzScreen',
        component:lazy(() => import('../pages/ScreenDz/index')),
        pageName:'DzGame'

    }
]

// 路由参数分发
const RouterParamsProvider = (props:any) => {
    const params = useParams();
    const location = useLocation();

    const {children} = props;

    return React.cloneElement(children,{
        params,
        location,
        key: params.uid, // key保证同路由下参数改变能rerender
    })

}

// 路由加载页面Loding
const Loading = ():React.ReactNode => {
    return (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',height:'100vh',width:'100%',justifyContent:'center'}}>
            <SpinLoading color='primary' />
        </div>
    )
}
// 路由处理
const handleRoutesConfig = (routers:any):any => {

    return routers.map((item:any)=>{
        const { path, component: Element, children, ...rest } = item
        
        if (item.children) {
            item.children = handleRoutesConfig(item.children)
        }

        item.element = (
            <Suspense fallback={Loading()}>
                <RouterParamsProvider>
                    <Element {...rest} />
                </RouterParamsProvider>
            </Suspense>
        )
        return item
    })
}

// 开启history
const history = createBrowserHistory();

const Routers = () => {
    const Routes = () => useRoutes(handleRoutesConfig(routeConfig))

    return (
        <HistoryRouter history={history} >
             <Routes />
        </HistoryRouter>
    )
}

export {Routers,history,routeConfig}

