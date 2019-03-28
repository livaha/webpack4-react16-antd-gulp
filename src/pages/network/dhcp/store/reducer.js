import {fromJS} from 'immutable';
import * as ACTIONTYPE from './actionType';

const defaultState = fromJS({
    enable:false,
    startip:'',
    endip:'',
    minip:'',
    maxip:'',
    leasetime:'',
    static_dhcp:[],
    dhcpList:[],
    arpList:[]
});

export default (state = defaultState , action)=>{
    switch(action.type){
        case ACTIONTYPE.DHCP_MSG:
            return state.merge({
                enable:action.enable,
                minip:action.minip,
                maxip:action.maxip,
                startip:action.startip,
                endip:action.endip,
                leasetime:action.leasetime,
                static_dhcp:action.static_dhcp,
                dhcpList:action.dhcpList
            })

        case ACTIONTYPE.ARP_LIST:
            return state.merge({
                arpList:action.arpList
            })
        case ACTIONTYPE.DHCP_ENABLE:
            return state.merge({
                enable:action.enable
            })

        default:
            return state;
    }
}