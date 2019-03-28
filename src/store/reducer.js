import {combineReducers} from 'redux-immutable';
import {reducer as headerReducer} from '@/components/Header/store';
import {reducer as loginReducer} from '@/pages/login/store';

//import {reducer as wanReducer} from '@/pages/network/wan/store';
import {reducer as lanReducer} from '@/pages/network/lan/store';
import {reducer as dhcpReducer} from '@/pages/network/dhcp/store';

import {reducer as setlogReducer} from '@/pages/setup/SetLog/store';
import {reducer as settimeReducer} from '@/pages/setup/SetTime/store';
import {reducer as tickrebootReducer} from '@/pages/setup/TickReboot/store';

//import {reducer as apstatusReducer} from '@/pages/apManagement/status/store';

const reducer = combineReducers({
    header:headerReducer,
    login:loginReducer,
    
    //wan:wanReducer,
    lan:lanReducer,
    dchp:dhcpReducer,

    setlog:setlogReducer,
    settime:settimeReducer,
    tickreboot:tickrebootReducer,
    //apstatus:apstatusReducer
})

export default reducer;