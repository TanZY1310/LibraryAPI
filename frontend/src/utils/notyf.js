import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
    types: [
        {
            type: 'success',
            background: '#2ecc71',
        },
        {
            type: 'error',
            background: '#e74c3c',
        },
    ],
});

export default notyf;