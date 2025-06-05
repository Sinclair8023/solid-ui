/* @refresh reload */
import { render } from 'solid-js/web';
import '@solid-ui/theme-chalk/index.scss';
import App from './App';

render(() => <App />, document.getElementById('root') as HTMLElement);
