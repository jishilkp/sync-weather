import { IonContent, IonPage } from '@ionic/react';
import Weather from '../components/Weather';
import PoweredBy from '../components/PoweredBy';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="wrapper" fullscreen>
        <Weather />
      </IonContent>
      <PoweredBy />
    </IonPage>
  );
};

export default Home;
