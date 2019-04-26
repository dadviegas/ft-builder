import { networkInterfaces } from 'os';

const interfaces = networkInterfaces();

const addresses = Object.keys(interfaces)
  .reduce((results, name) => results.concat(interfaces[name]), [])
  .filter((result) => result.family === 'IPv4' && !result.internal)
  .map((result) => result.address);

const localIp = addresses[0];

export default localIp;

export const getLocalHttpAddress = (port) => `http://${localIp}:${port}`;
export const getLocalIpAddress = (port) => `${localIp}:${port}`;
