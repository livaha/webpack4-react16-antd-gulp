const menuList = [
    {
        title: '系统状态',
        key: '/status',
        type:'',
    },/*
    {
        title: '系统状态',
        key: '/status',
        type:'',
        children: [
            {
                title: '端口连接信息',
                key: '/status/portInfo',
                type:'',
            },
            {
                title: '系统运行信息',
                key: '/status/runInfo',
                type:'',
            },
            {
                title: '局域网设备在线',
                key: '/status/lanOnline',
                type:'',
            },
            {
                title: '实时流量统计信息',
                key: '/status/traffic',
                type:'',
            },
        ]
    },*/
    {
        title: '网络设置',
        key: '/network',
        type:'',
        children: [
            {
                title: '外网设置',
                key: '/network/wan',
                type:'',
            },
            {
                title: '局域网设置',
                key: '/network/lan',
                type:'',
            },
            {
                title: 'DHCP设置',
                key: '/network/dhcp',
                type:'',
            }
        ]
    },
    {
        title: 'QOS设置',
        key: '/qos',
        type:'',
    },
    {
        title: '上网行为管理',
        key: '/behavior',
        type:'',
        children: [
            {
                title: '应用过滤',
                key: '/behavior/appFilter',
                type:'',
            },
            {
                title: 'MAC访问控制',
                key: '/behavior/macFilter',
                type:'',
            },
            {
                title: '自定义网站过滤',
                key: '/behavior/urlFilter',
                type:'',
            },
            {
                title: 'IP/端口过滤',
                key: '/behavior/ipfilter',
                type:'',
            },/*
            {
                title: '行为记录管理',
                key: '/behavior/record',
                type:'',
            },*/
            {
                title: '终端连接数控制',
                key: '/behavior/connectNumber',
                type:'',
            },
        ]
    },
    {
        title: 'AP集中管理',
        key: '/apManagement',
        type:'',
        children: [
            {
                title: 'AP状态',
                key: '/apManagement/status',
                type:'',
            },
            {
                title: 'AP群组设置',
                key: '/apManagement/groupUnified',
                type:'',
            },
            {
                title: 'AP升级设置',
                key: '/apManagement/upgrade',
                type:'',
            },
            {
                title: '高级配置',
                key: '/apManagement/advanceconfig',
                type:'',
            },
            {
                title: '数据库管理',
                key: '/apManagement/databasemanage',
                type:'',
            },
        ]
    },
    {
        title: '认证设置',
        key: '/captive_portal',
        type:'',
        children: [
            {
                title: 'portal设置',
                key: '/captive_portal/setting',
                type:'',
            },
            {
                title: 'portal白名单',
                key: '/captive_portal/garden',
                type:'',
            },
        ]
    },
    {
        title: '高级功能',
        key: '/advanced',
        type:'',
        children: [
            {
                title: '端口映射',
                key: '/advance/portForward',
                type:'',
            },
            {
                title: 'DMZ设置',
                key: '/advance/dmz',
                type:'',
            },
            {
                title: 'DDNS设置',
                key: '/advance/ddns',
                type:'',
            },
            {
                title: 'UPNP设置',
                key: '/advance/upnp',
                type:'',
            },
            {
                title: '静态路由',
                key: '/advance/staticRouter',
                type:'',
            },
            {
                title: '策略路由',
                key: '/advance/dynamicRouter',
                type:'',
            },
        ]
    },
    {
        title: '安全设置',
        key: '/security',
        type:'',
        children: [
            {
                title: 'ARP列表',
                key: '/security/ARPlist',
                type:'',
            },
            {
                title: 'ARP绑定设置',
                key: '/security/ARPbind',
                type:'',
            },
            {
                title: 'WanPing设置',
                key: '/security/wanping',
                type:'',
            },
        ]
    },
    /*
    {
        title: 'VPN设置',
        key: '/vpn',
        type:'',
        children: [
            {
                title: 'L2TP',
                key: '/vpn/l2tp',
                type:'',
            },
            {
                title: 'PPTP',
                key: '/vpn/pptp',
                type:'',
            },
            {
                title: 'OpenVPN',
                key: '/vpn/openVpn',
                type:'',
            },
        ]
    },*/
    {
        title: '系统工具',
        key: '/tools',
        type:'',
        children: [
            /*{
                title: '网络自检',
                key: '/tools/selfCheck',
                type:'',
            },*/
            {
                title: 'Ping测试',
                key: '/tools/ping',
                type:'',
            },
            {
                title: '路由跟踪',
                key: '/tools/routeTrack',
                type:'',
            },
            {
                title: 'DHCP检测',
                key: '/tools/dhcptest',
                type:'',
            },
        ]
    },
    {
        title: '系统设置',
        key: '/setup',
        type:'',
        children: [
            {
                title: '远程管理',
                key: '/setup/remote',
                type:'',
            },
            {
                title: '修改密码',
                key: '/setup/password',
                type:'',
            },
            {
                title: '系统日志',
                key: '/setup/log',
                type:'',
            },
            {
                title: '系统时间',
                key: '/systime',
                //key: '/setup/time',
                type:'',
            },
            {
                title: '系统升级',
                key: '/setup/upgrade',
                type:'',
            },
            {
                title: '系统恢复/备份/重启',
                key: '/setup/administration',
                //key: '/setup/restart',
                type:'',
            },
            {
                title: '定时重启',
                key: '/sche_reboot',
                //key: '/setup/tickreboot',
                type:'',
            },
        ]
    },
    {
        title: '设置引导项',
        key: '/wizard',
        /*children: [
            {
                title: '互联网设置',
                key: '/wizard/net_set',
                type:'',
            },
            {
                title: 'AC配网',
                key: '/wizard/ac_network',
                type:'',
            },
        ]*/
    },
];
export default menuList;