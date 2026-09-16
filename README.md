# WorldWise

WorldWise is a React travel diary for recording cities visited around the world. Users can select a map location, retrieve location details, save a city with a visit date and notes, browse saved cities or countries, and open an individual city entry.

## Implemented Features

- Leaflet map with OpenStreetMap tiles, saved-city context, map click navigation, and browser geolocation.
- Reverse geocoding through BigDataCloud to prefill city and country information when a map location is selected.
- City creation, listing, detail views, and deletion backed by a local JSON Server API.
- Country grouping derived from the saved city collection.
- Date selection with `react-datepicker`, notes, country-flag emoji conversion, loading spinners, and empty-state messages.
- Client-side routes for the landing, product, pricing, login, protected application, city details, and not-found views.
- Transitland stop and route requests rendered as map markers and GeoJSON route layers. This integration is experimental and is not part of the core city workflow.

## React and Engineering Contribution

This project demonstrates a frontend foundation built around reusable components, CSS Modules, React Router, custom hooks, and shared context state. `CitiesContextProvider` owns city data, loading state, CRUD requests, and transit results. `FakeAuthContext` uses `useReducer` for login/logout state, while `ProtectedRout` guards the `/app` route. Forms are controlled with React state, and `useEffect` coordinates data loading with route parameters and external APIs.

The application flow is:

1. `App` composes the auth and cities providers and defines the route tree.
2. `CitiesContextProvider` loads cities from `http://localhost:9000/cities` and exposes create, read, and delete actions.
3. A map click adds `lat` and `lng` to the URL. `Form` uses those values for reverse geocoding, then POSTs the completed city to JSON Server.
4. City and country views consume the shared collection; city detail pages fetch an individual record and delete actions update shared state.
5. Map interactions can request nearby Transitland stops and visible route geometry, which are transformed into Leaflet markers and layers.

## Technologies

- React 18 and React DOM for the component-based UI.
- Vite for development, bundling, and preview scripts.
- React Router DOM for nested routes, route parameters, navigation, URL search parameters, and protected content.
- React Context, `useReducer`, `useState`, and `useEffect` for application state and side effects.
- React Leaflet and Leaflet for the interactive map, markers, popups, and GeoJSON routes.
- `fetch` for JSON Server, BigDataCloud, and Transitland requests.
- JSON Server for the local city REST API stored in `data/cities.json`.
- CSS Modules for component-scoped styling.
- `react-datepicker` for visit-date input.

## Project Structure

```text
src/
	App.jsx                 Route tree and provider composition
	components/             Map, forms, lists, navigation, and reusable UI
	contexts/               City data and demo authentication state
	hooks/                  Geolocation and URL-location hooks
	pages/                  Public pages, protected layout, and route guard
	transitLand/            Transitland search UI
data/cities.json          JSON Server data source
```

## Run Locally

```bash
cd World-Wise-React-Js
npm install
```

Start the local API in one terminal:

```bash
npm run server
```

Start the Vite app in a second terminal:

```bash
npm run dev
```

The package also defines `npm run build`, `npm run preview`, and `npm run lint`. The demo login accepts `jack@example.com` with password `qwerty`.

## Key Learnings

- Separating shared server-backed state from presentational components with Context.
- Coordinating routing, URL search parameters, asynchronous effects, and form submission.
- Building reusable loading, message, button, navigation, list, and map components.
- Translating external API responses into application data and map-specific coordinates.
- Protecting nested routes and modeling authentication transitions with a reducer.

## Limitations and Future Improvements

- Authentication is a hard-coded demo context, not a real user or session system.
- City data uses a local JSON Server and has no production persistence or validation layer.
- `Maps.jsx` imports `lodash.debounce`, but `lodash.debounce` is not declared in `package.json`; this dependency should be added before relying on a clean install/build.
- `src/pages/AppLayout.jsx` imports `sideBar` while the file is named `SideBar.jsx`; this should be normalized for case-sensitive environments.
- Transitland requests use an embedded API key and include incomplete/experimental flows; the key should be moved to environment configuration and the integration completed.
- Product and pricing pages still contain placeholder copy, and the app has no automated tests.

## Author

Repository: [ahmadabdul786/World-Wise-React-Js](https://github.com/ahmadabdul786/World-Wise-React-Js)
