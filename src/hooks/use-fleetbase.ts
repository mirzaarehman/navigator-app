import { useMemo, useState, useEffect, useCallback } from 'react';
import Fleetbase from '@fleetbase/sdk';
import { useConfig } from '../contexts/ConfigContext';
import useStorage from './use-storage';

const useFleetbase = () => {
    const { resolveConnectionConfig } = useConfig();
    const FLEETBASE_KEY = resolveConnectionConfig('FLEETBASE_KEY');
    const FLEETBASE_HOST = resolveConnectionConfig('FLEETBASE_HOST');

    const [error, setError] = useState<Error | null>(null);
    const [authToken] = useStorage('_driver_token');
    // Do not initialize until we have an auth token or a selected key
    const [fleetbase, setFleetbase] = useState<Fleetbase | null>(null);

    const hasFleetbaseConfig = useCallback(() => {
        const FLEETBASE_KEY = resolveConnectionConfig('FLEETBASE_KEY');
        const FLEETBASE_HOST = resolveConnectionConfig('FLEETBASE_HOST');

        return typeof FLEETBASE_KEY === 'string' && typeof FLEETBASE_HOST === 'string';
    }, [resolveConnectionConfig]);

    useEffect(() => {
        const FLEETBASE_HOST = resolveConnectionConfig('FLEETBASE_HOST');
        const FLEETBASE_KEY = resolveConnectionConfig('FLEETBASE_KEY');

        // Mask sensitive values for logging
        const mask = (v?: string) => (typeof v === 'string' && v.length > 8 ? `${v.slice(0, 4)}***${v.slice(-4)}` : v);

        // If neither auth token nor selected key is present, do not initialize
        if (!authToken && !FLEETBASE_KEY) {
            console.log('[Fleetbase] Skipping initialization: no auth token or selected API key present');
            setFleetbase(null);
            return;
        }

        console.log('[Fleetbase] Initializing');
        console.log('[Fleetbase] Host:', FLEETBASE_HOST);
        console.log('[Fleetbase] Using auth token:', Boolean(authToken));
        if (!authToken) {
            console.log('[Fleetbase] Using API key:', mask(FLEETBASE_KEY));
        }

        try {
            // If authToken is present, initialize a new Fleetbase instance with it,
            // otherwise fall back to the default configuration.
            const fleetbase = authToken ? new Fleetbase(authToken, { host: FLEETBASE_HOST }) : new Fleetbase(FLEETBASE_KEY, { host: FLEETBASE_HOST });
            setFleetbase(fleetbase);
            console.log('[Fleetbase] Initialized successfully');
        } catch (initializationError) {
            setError(initializationError as Error);
            console.log('[Fleetbase] Initialization error:', initializationError);
        }
    }, [authToken, resolveConnectionConfig]);

    // Memoize the adapter so that its reference only changes when the fleetbase instance updates.
    const adapter = useMemo(() => {
        if (!fleetbase) return null;
        return fleetbase.getAdapter();
    }, [fleetbase, authToken]);

    // Memoize the returned object to prevent unnecessary re-renders.
    const api = useMemo(
        () => ({
            fleetbase,
            adapter,
            error,
            hasFleetbaseConfig,
        }),
        [fleetbase, adapter, error, authToken, hasFleetbaseConfig]
    );

    return api;
};

export default useFleetbase;
