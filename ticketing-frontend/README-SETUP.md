# Login and Registration: setup

This archive contains ONLY the files for the Login and Registration pages.
It does not contain package.json, angular.json, tsconfig.json or node_modules,
so your existing Angular project configuration stays untouched.
No new npm packages are needed (Bootstrap is not required by these pages).

## Files in this archive (extract into your ticketing-frontend folder)

ticketing-frontend/
├── proxy.conf.json                      (optional, only if you hit a CORS error)
└── src/app/
    ├── app.config.ts                    (REPLACES existing: adds provideHttpClient)
    ├── app.routes.ts                    (REPLACES existing: login/register routes)
    ├── app.html                         (REPLACES existing: just <router-outlet />)
    ├── models/auth.models.ts            (new)
    ├── services/auth.service.ts         (new)
    ├── shared/auth-shared.css           (new: styles used by both pages)
    └── pages/
        ├── login/login.ts, login.html   (new)
        └── register/register.ts, register.html   (new)

## Install

1. Close the dev server if it is running.
2. Back up (or commit to Git) your current src/app/app.config.ts, app.routes.ts, app.html.
3. Extract the zip so the "src" folder lands inside ticketing-frontend/ and allow overwrite.
4. Make sure src/app/app.ts has RouterOutlet in its imports (the default project does).
5. If the generator created src/app/pages/login/login.css or register.css earlier, delete them.

## Run

cd ticketing-frontend
npm install        (only if node_modules is missing)
npm start

Open http://localhost:4200 and start Spring Boot from IntelliJ on port 8080.

## If the browser shows a CORS error

1. In src/app/services/auth.service.ts change:
     private readonly apiUrl = 'http://localhost:8080/api/auth';
   to:
     private readonly apiUrl = '/api/auth';
2. Run:
     npx ng serve --proxy-config proxy.conf.json
