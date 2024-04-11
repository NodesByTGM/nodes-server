import { authSwagger } from './auth.doc';
import { onboardingSwagger } from './onboarding.doc';
import { usersSwagger } from './users.doc';
// import { upgradesSwagger } from './upgrades.doc';
import { mediaSwagger } from './uploads.doc';
import { projectsSwagger } from './projects.doc'
import { jobSwagger } from './jobs.doc';
import { eventSwagger } from './events.doc';
import { transactionSwagger } from './transactions.doc';
import { communitySwagger } from './community.doc';
import { postsSwagger } from './posts.doc';
import { spacesSwagger } from './spaces.doc';
import { adminAuthSwagger } from './admin.auth.doc';
import { thirdpartySwagger } from './thirdparty.doc';

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
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    // type: 'http',
                    // schema: 'bearer',
                    // bearerFormat: 'JWT',
                    description: 'Enter your token like this: "Bearer <ACCESS_TOKEN>"',
                }
            }
        },
        servers: [
            {
                url: "http://localhost:3001/",
                description: "Local server"
            },
            {
                url: "https://dev.api.nodesafrica.com/",
                description: "Dev server"
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
            ...mediaSwagger.paths,
            ...postsSwagger.paths,
            // ...communitySwagger.paths,
            ...spacesSwagger.paths,
            ...adminAuthSwagger.paths,
            ...thirdpartySwagger.paths
            // ...upgradesSwagger.paths,
        }
    },
    // If this was in the folder same as index.ts
    // apis: ['/*.ts'], // Path to the API routes
};
// const swaggerSpec = swaggerJSDoc(options);
export default options.definition