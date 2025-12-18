# How to run
`npm run dev` in `/my-app`, with concurrently it will start up frontend at `localhost:5173` and backend at `localhost:8000`




https://github.com/user-attachments/assets/a57b7623-519b-4d6c-b9f7-d11207e81749



## Things I did

- chose to use vite, daisyUI, pydantic and fastAPI.
- wrote backend first and their dummy tests

## Things I compromised

- You can't rename the codes. This is a trivial fix as it borrows from categories.
- I didn't make custom hooks until the end, I would've rathered done this sooner.
- JS over Typescript, I'd much rather write Typescript.
- There's nicer packages in React for doing request/response and handling errors. React query I've had some familiarity with before.

## Future Work

-Auth, you'd use a package as there's many solutions (Clerk is a paid all service, i think Auth0 you can use their SDKs, FastAPI has library for auth), or we'd have to inspect the headers and web tokens sent to us ourselves. Ultimately, I think there's better solutions than doing this manually given it's a common problem.

- Concurrency, i've async awaited for request response. Unless you want to parallelize the client requests so you fetch lots of things at once, I think this is fine. On the backend, if we have alot of data or expect lots of throughput, you'd need to consider celery. If there's a process of sending say emails to thousands of users at the same time, then I'd consider using celery on the backend.

- Scaling I'd only consider when it's a problem, as we need hundreds or thousands of users first to then have scaling be an issue. The immediate fixes could be having a cache like redis to quickly retrieve data rather than go to database. You can also index the database so data retrieved most often is easier to find. I also think you would consider the deployments, you'd just scale up the size of everything.
