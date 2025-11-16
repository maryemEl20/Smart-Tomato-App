import { ActivityCard } from '../activity-card';

export default function ActivityCardExample() {
  return (
    <div className="p-8 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <ActivityCard
          type="watering"
          title="Prochain arrosage"
          nextDate="8 Nov 2025, 06:00"
          countdown="Dans 2 heures"
          status="Programmé"
          onEdit={() => console.log('Edit watering')}
        />
        <ActivityCard
          type="fertilizer"
          title="Apport d'engrais"
          nextDate="10 Nov 2025, 08:00"
          countdown="Dans 2 jours"
          status="En attente"
          onEdit={() => console.log('Edit fertilizer')}
        />
        <ActivityCard
          type="harvest"
          title="Prochaine récolte"
          nextDate="25 Nov 2025"
          countdown="Dans 18 jours"
          status="Planifié"
          onEdit={() => console.log('Edit harvest')}
        />
      </div>
    </div>
  );
}
