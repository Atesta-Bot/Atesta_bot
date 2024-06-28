import { useState, createContext, useContext, useEffect, useRef } from "react";

// ReactContext to simplify access of StripeOnramp object
const CryptoElementsContext = createContext(null);
CryptoElementsContext.displayName = 'CryptoElementsContext';

export const CryptoElements = ({
    stripeOnramp,
    children,
  }: any) => {
    const [ctx, setContext] = useState<{ onramp: unknown | null }>(() => ({
      onramp: null,
    } as { onramp: unknown | null | undefined }));
  
    useEffect(() => {
      let isMounted = true;
  
      Promise.resolve(stripeOnramp).then((onramp) => {
        if (onramp && isMounted) {
          setContext((ctx) => (ctx && ctx.onramp ? ctx : { onramp }));
        }
      });
  
      return () => {
        isMounted = false;
      };
    }, [stripeOnramp]);
  
    return (
      <CryptoElementsContext.Provider value={ctx}>
        {children}
      </CryptoElementsContext.Provider>
    );
  };
  
  // React hook to get StripeOnramp from context
  export const useStripeOnramp = () => {
    const context = useContext(CryptoElementsContext);
    return context?.onramp;
  };
  
  // React element to render Onramp UI
  const useOnrampSessionListener = (
    type,
    session,
    callback
  ) => {

    useEffect(() => {
      if (session && callback) {
        const listener = (e: any) => callback(e.payload);
        session.addEventListener(type, listener);
        return () => {
          session.removeEventListener(type, listener);
        };
      }
      return () => {};
    }, [session, callback, type]);
  };

export const OnrampElement = ({
    clientSecret,
    appearance,
    onReady,
    onChange,
    ...props
  }: any) => {
    const stripeOnramp = useStripeOnramp();
    const onrampElementRef = useRef(null);
    const [session, setSession] = useState();
  
    const appearanceJSON = JSON.stringify(appearance);

    useEffect(() => {
      const containerRef = onrampElementRef.current;
      if (containerRef) {
        // NB: ideally we want to be able to hot swap/update onramp iframe
        // This currently results a flash if one needs to mint a new session when they need to udpate fixed transaction details
        containerRef.innerHTML = '';
  
        if (clientSecret && stripeOnramp) {
          setSession(
            stripeOnramp
              .createSession({
                clientSecret,
                appearance: appearanceJSON ? JSON.parse(appearanceJSON) : {}
              })
              .mount(containerRef)
          );
        }
      }
    }, [appearanceJSON, clientSecret, stripeOnramp]);
  
    useOnrampSessionListener('onramp_ui_loaded', session, onReady);
    useOnrampSessionListener('onramp_session_updated', session, onChange);
  
    return <div {...props} ref={onrampElementRef}></div>;
  };