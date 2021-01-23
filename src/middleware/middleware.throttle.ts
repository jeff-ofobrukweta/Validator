import rateLimit from 'express-rate-limit';
import { environment } from '../config/enviroment.config/enviroment.variables';

// Implemented to avid DDOS attack on server
// can add redis for this throttling imp but for simplicity its just left static  
export const rateLimiterUsingThirdParty = rateLimit(environment.throttling);