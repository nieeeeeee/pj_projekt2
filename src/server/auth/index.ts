import {getServerSession} from 'next-auth';
import {authOptions} from './config';

// Export authOptions for use in the route handler
export {authOptions};

// Export auth function for server-side session access
export const auth = async () => {
    const session = await getServerSession();
    if (session != null) {
        return session

    }

};
