import { authSwagger } from './auth.doc';
import { onboardingSwagger } from './onboarding.doc';
import { usersSwagger } from './users.doc';
import { upgradesSwagger } from './upgrades.doc';
import { deleteMediaSwagger, uploadMediaSwagger } from './uploads.doc';
import { projectsSwagger } from './projects.doc'
import { jobSwagger } from './jobs.doc';
import { eventSwagger } from './events.doc';
import { transactionSwagger } from './transactions.doc';
// import pjson from '../../package.json';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Nodes API',
            version: '1.0.0',
            description: 'API documentation for Nodes Server',
            contact: {
                name: "Elijah Soladoye",
                email: "elijah@thegridmanagement.com",
                url: "https://elijahsoladoye.vercel.app"
            },
        },
        servers: [
            {
                url: "http://localhost:3001/",
                description: "Local server"
            },
            {
                url: "https://nodes-server-v1.onrender.com/",
                description: "Dev server"
            },
            {
                url: "https://nodes-api.thegridmanagement.com/",
                description: "Live server"
            },
        ],
        paths: {
            ...authSwagger.paths,
            ...onboardingSwagger.paths,
            ...usersSwagger.paths,
            ...projectsSwagger.paths,
            ...eventSwagger.paths,
            ...jobSwagger.paths,
            ...transactionSwagger.paths,
            ...uploadMediaSwagger.paths,
            ...deleteMediaSwagger.paths,
            // ...upgradesSwagger.paths,
        }
    },
    // If this was in the folder same as index.ts
    // apis: ['/*.ts'], // Path to the API routes
};
// const swaggerSpec = swaggerJSDoc(options);
export default options.definition