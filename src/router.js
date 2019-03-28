import React from 'react'
import {HashRouter , Route , Switch , Redirect} from 'react-router-dom'

import {  message  } from 'antd';

import Common from './common'

import App from './App'
import Login from './pages/login'
import CheckLogin from './pages/login/checkLogin'
import ComponentNoMatch from './pages/noMatch'

import ComponentSysStatus from './pages/sysStatus'

import ComponentRemote from './pages/setup/Remote'
import ComponentSetPassword from './pages/setup/SetPassword'
import ComponentSetTime from './pages/setup/SetTime'
import ComponentSetRestart from './pages/setup/SetRestart'
import ComponentTickReboot from './pages/setup/TickReboot'
import ComponentSetUpgrade from './pages/setup/SetUpgrade'
import ComponentSetLog from './pages/setup/SetLog'

import ComponentWan from './pages/network/wan'
import ComponentLan from './pages/network/lan'
import ComponentDhcp from './pages/network/dhcp'


import ComponentARPlist from './pages/security/ARPlist'
import ComponentARPbind from './pages/security/ARPbind'
import ComponentWanPing from './pages/security/wanping'

import ComponentApStatus from './pages/apManagement/status'
import ComponentGroupUnified from './pages/apManagement/groupUnified'
import ComponentAPUpgrade from './pages/apManagement/upgrade'
import ComponentAPAdvanceConfig from './pages/apManagement/advanceconfig'
import ComponentAPDatabaseManage from './pages/apManagement/databasemanage'

import ComponentSuperadmin from './pages/superadmin'

import ComponentAppFilter from './pages/behavior/appFilter'
import ComponentMacFilter from './pages/behavior/macFilter'
import ComponentUrlFilter from './pages/behavior/urlFilter'
import ComponentIpFilter from './pages/behavior/ipFilter'
import ComponentConnectNumber from './pages/behavior/connectNumber'

import ComponentQos from './pages/qos'

import ComponentPing from './pages/tools/ping'
import ComponentRouteTrack from './pages/tools/routeTrack'
import ComponentDhcptest from './pages/tools/dhcptest'

import ComponentPortForward from './pages/advance/portForward'
import ComponentDmz from './pages/advance/dmz'
import ComponentDdns from './pages/advance/ddns'
import ComponentUpnp from './pages/advance/upnp'
import ComponentStaticRouter from './pages/advance/staticRouter'
import ComponentDynamicRouter from './pages/advance/dynamicRouter'

import ComponentPortalSetting from './pages/portal/setting'
import ComponentPortalGarden from './pages/portal/garden'

import ComponentWizard from './pages/wizard'
import ComponentPortal from './pages/portal/portal'

export default class IRouter extends React.Component {
    componentDidMount(){
      //TODO 获取title
      /*message.config({
        top: 80,
        duration: 2,
      });*/
    }
    render() {
      //document.title= 'test'
      
      return (
        <div>
          <HashRouter>
              {/*App组件的主要作用是将所有的子组件都放在一个根组件下，可以处理同级的路由 */}
            <App>
                <Switch>
                {/*<Route path="/admin" component={Admin} />*/}                    
                    <Route path="/login" component={Login} />
                    
                    <Route path="/admin" render={() =>
                        <Common>
                            <Route path="/admin/superadmin" component={ComponentSuperadmin} />
                        </Common>
                    }
                    />
                    <Route path="/portal" component={ComponentPortal}/>
                    <Route path="/wizard" render={() =>
                        <Common>
                            <Route  path="/wizard"  component={ComponentWizard} />
                        </Common>
                    }
                    />
                    
                    <Route path="/" render={()=>
                        <CheckLogin>
                        <Switch>
                            <Route path="/status" component={ComponentSysStatus} />

                            <Route path="/setup/remote" component={ComponentRemote} />
                            <Route path="/setup/password" component={ComponentSetPassword} />
                            <Route path="/systime" component={ComponentSetTime} />
                            <Route path="/setup/administration" component={ComponentSetRestart} />
                            <Route path="/sche_reboot" component={ComponentTickReboot} />
                            <Route path="/setup/upgrade" component={ComponentSetUpgrade} />
                            <Route path="/setup/log" component={ComponentSetLog} />
                            
                            <Route path="/network/wan" component={ComponentWan} />
                            <Route path="/network/lan" component={ComponentLan} />
                            <Route path="/network/dhcp" component={ComponentDhcp} />

                            <Route path="/security/ARPlist" component={ComponentARPlist} />
                            <Route path="/security/ARPbind" component={ComponentARPbind} />
                            <Route path="/security/wanping" component={ComponentWanPing} />

                            <Route path="/apManagement/status" component={ComponentApStatus} />
                            <Route path="/apManagement/groupUnified" component={ComponentGroupUnified} />
                            <Route path="/apManagement/upgrade" component={ComponentAPUpgrade} />
                            <Route path="/apManagement/advanceconfig" component={ComponentAPAdvanceConfig} />
                            <Route path="/apManagement/databasemanage" component={ComponentAPDatabaseManage} />

                            <Route path="/behavior/appFilter" component={ComponentAppFilter} />
                            <Route path="/behavior/macFilter" component={ComponentMacFilter} />
                            <Route path="/behavior/urlFilter" component={ComponentUrlFilter} />
                            <Route path="/behavior/ipfilter" component={ComponentIpFilter} />
                            <Route path="/behavior/connectNumber" component={ComponentConnectNumber} />
                            
                            <Route path="/qos" component={ComponentQos} />

                            <Route path="/tools/ping" component={ComponentPing} />
                            <Route path="/tools/routeTrack" component={ComponentRouteTrack} />
                            <Route path="/tools/dhcptest" component={ComponentDhcptest} />

                            <Route path="/advance/portForward" component={ComponentPortForward} />
                            <Route path="/advance/dmz" component={ComponentDmz} />
                            <Route path="/advance/ddns" component={ComponentDdns} />
                            <Route path="/advance/upnp" component={ComponentUpnp} />
                            <Route path="/advance/staticRouter" component={ComponentStaticRouter} />
                            <Route path="/advance/dynamicRouter" component={ComponentDynamicRouter} />

                            <Route path="/captive_portal/setting" component={ComponentPortalSetting} />
                            <Route path="/captive_portal/garden" component={ComponentPortalGarden} />
                            <Redirect to="/status" />
                            {/* <Route component={ComponentNoMatch} /> */}
                        </Switch>
                        </CheckLogin>
                    }/>
                    </Switch>
            </App>
          </HashRouter>
        </div>
      );
    }
  }


  