# Smart Tomato App

## Description du projet
Smart Tomato App est une application intelligente destinée à la surveillance et à l'analyse de la croissance des tomates. L'objectif est d'aider les agriculteurs à optimiser la qualité et la quantité de leur production en utilisant des techniques modernes de collecte et d'analyse de données.  

L'application fournit des recommandations personnalisées sur :
- La fertilisation optimale selon le stade de croissance de la plante.
- L'irrigation adaptée à la teneur en eau du sol.
- La détection de conditions critiques (pH, humidité, température, etc.) grâce aux capteurs IoT.

## Sources des données
Les données utilisées dans ce projet proviennent de plusieurs sources fiables pour offrir une analyse complète et précise :

1. **Guides et recommandations de fertilisation**  
   [Haifa Group – Tomato Crop Guide: Fertilization Recommendations](https://www.haifa-group.com/tomato-fertilizer/tomato-crop-guide-fertilization-recommendations)

2. **Instructions générales sur la culture de la tomate**  
   [Haifa Group – Growing Tomato](https://www.haifa-group.com/articles/growing-tomato-%20and-how-to-grow-tomato)

3. **Jeu de données pour la croissance des tomates**  
   [Mendeley Data](https://data.mendeley.com/datasets/33cngpcrmx/2)

Ces sources permettent de combiner données réelles de terrain et connaissances théoriques pour générer des recommandations fiables.

## Architecture et technologies utilisées
Le projet utilise une architecture moderne distribuée, composée de plusieurs composants intégrés :

### 1. **Docker**
- Conteneurisation des services pour simplifier le déploiement et garantir l'isolation des environnements.
- Chaque service (Firebase, Spark, HDFS, etc.) fonctionne dans son propre conteneur.

### 2. **HDFS (Hadoop Distributed File System)**
- Stockage des grandes quantités de données générées par les capteurs et les jeux de données externes.
- Permet un accès rapide et distribué pour l'analyse avec Spark.

### 3. **Firebase**
- Collecte en temps réel des données issues des capteurs IoT (pH, humidité, température, niveaux d'engrais et d’eau).
- Synchronisation instantanée avec l'application et le dashboard.

### 4. **Apache Spark**
- Traitement distribué des données stockées sur HDFS.
- Analyse et génération de modèles pour la prédiction des besoins en eau et fertilisation.
- Export des résultats vers le dashboard en temps réel.

### 5. **Dashboard / Interface de visualisation**
- Visualisation des données collectées et des recommandations.
- Interface simple et interactive pour les utilisateurs finaux (agriculteurs).
- Possibilité de surveiller les niveaux critiques et recevoir des alertes.

### 6. **Pipeline de données**
1. Collecte via Firebase depuis les capteurs.
2. Stockage dans HDFS pour traitement volumineux.
3. Traitement et analyse avec Spark.
4. Envoi des résultats vers le dashboard pour visualisation et décisions.

## Fonctionnalités principales
- Surveillance en temps réel des paramètres de croissance des tomates.
- Recommandations automatiques pour l’irrigation et la fertilisation.
- Alertes pour conditions critiques (pH, humidité, nutriments, etc.).
- Analyse historique pour suivre la performance des cultures sur le temps.
- Interface simple et intuitive pour les agriculteurs.

## Objectifs du projet
- Optimiser la croissance et la qualité des tomates.
- Réduire le gaspillage de ressources (eau, engrais).
- Fournir un outil d’aide à la décision pour les agriculteurs utilisant les technologies modernes Big Data et IoT.

---

Ce README peut être complété par des schémas d'architecture (Docker + HDFS + Spark + Firebase) pour rendre la documentation plus visuelle.
