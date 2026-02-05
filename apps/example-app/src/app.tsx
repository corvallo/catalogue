import { Toggle } from "./components/toggle";

export const App = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1>Example App</h1>
      <Toggle label="Enable motion" checked={true} onChange={() => {}} />
    </div>
  );
};
