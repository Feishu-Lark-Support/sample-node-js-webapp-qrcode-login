import {networkInterfaces} from 'os'

export async function getMyIPAddress() {
    const allNetwork = networkInterfaces();
    let ipAddress = '';
    allNetwork['en0']?.forEach((net) => {
        if (net.family === 'IPv4') {
            ipAddress = net.address;
        }
    });
    allNetwork['WLAN']?.forEach((net) => {
        if (net.family === 'IPv4') {
            ipAddress = net.address
        }
    })
    return ipAddress;
}