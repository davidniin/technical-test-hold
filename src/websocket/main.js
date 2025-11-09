
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/notifications';

export function connectWS(opts = {}) {
    const {
        onDocumentCreated,
        onOpen,
        onClose,
        onError
    } = opts;

    let socket = null;
    let attempts = 0;
    let closedByUser = false;


    function openConnection() {
        socket = new WebSocket(WS_URL);

        socket.addEventListener('open', () => {
            attempts = 0;
            onOpen && onOpen();
        });

        socket.addEventListener('message', (event) => {
            let msg;
            try {
                msg = JSON.parse(event.data);
            } catch (err) {
                console.debug('[ws] invalid JSON', err);
                return;
            }

            const payload = msg.document ?? msg;
            if (payload?.DocumentID && payload?.DocumentTitle) {
                const mappedDoc = {
                    id: String(payload.DocumentID),
                    name: payload.DocumentTitle,
                    version: payload.Version ?? '1.0',
                    contributors: payload.UserName ? [payload.UserName] : [],
                    attachments: [],
                    createdAt: payload.Timestamp ?? new Date().toISOString()
                };
                onDocumentCreated(mappedDoc);
                return;
            }
        });


        socket.addEventListener('close', () => {
            onClose && onClose();

            if (closedByUser) return;

            attempts += 1;
            const delay = Math.min(1000 * 2 ** attempts, 15000);
            setTimeout(openConnection, delay);
        });

        socket.addEventListener('error', (err) => {
            onError && onError();
        });
    }

    openConnection();

    return () => {
        closedByUser = true;
        try {
            socket && socket.close();
        } catch {
        }
    };
}