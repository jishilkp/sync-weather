import './PoweredBy.css';
import {
  IonFooter, IonToolbar, IonTitle
} from '@ionic/react';
import React from 'react';


interface ContainerProps { }

const PoweredBy: React.FC<ContainerProps> = () => {

  return (
    <>
      <IonFooter className="powered-by">
        <IonToolbar>
          <IonTitle color="light">SyncWeather</IonTitle>
          <IonTitle color="light" size="small">Ver 1.1</IonTitle>
          <IonTitle color="light" size="small">© Jishil K P</IonTitle>
        </IonToolbar>
      </IonFooter>
    </>
  );
};

export default PoweredBy;
