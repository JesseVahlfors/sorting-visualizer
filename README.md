# Sorting Visualizer

An interactive sorting algorithm visualizer built with **React** and **Django REST Framework**.

The project visualizes sorting algorithms step by step. Sorting is performed by the Django backend, which returns a sequence of generic operations that the React frontend replays as an animation.

## Current Features

- Bubble Sort
- Selection Sort
- Step-by-step sorting visualization
- Play and pause controls
- Adjustable playback speed
- Generate random arrays
- Switch between sorting algorithms
- Shared operation protocol for different algorithms

## Architecture

The React frontend sends an array and selected algorithm to a generic Django API endpoint.

```text
React
  │
  │  POST /api/sorting/sort/
  │
  │  {
  │    "array": [...],
  │    "algorithm": "selection"
  │  }
  ▼
Django REST API
  │
  ├── validates the request
  ├── selects the requested algorithm
  └── generates sorting operations
          │
          ▼
React playback system
  │
  └── replays the operations as an animation
```

The frontend does not implement algorithm-specific playback logic. Each backend sorting algorithm produces operations using a shared protocol such as:

```text
compare
swap
sorted
```

This allows different sorting algorithms to use the same React visualization and playback system.

### Backend

This repository contains the React frontend for the Sorting Visualizer.

The Django REST API and sorting algorithm implementations are part of my portfolio backend:

**Backend repository:** [Portfolio](https://github.com/JesseVahlfors/Portfolio_project)

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript

**Backend**
- Python
- Django
- Django REST Framework

## Planned Features

- Additional sorting algorithms
  - Insertion Sort
  - Merge Sort
  - Quick Sort
- Support for additional visualization operations such as value writes
- Multiple sorting visualizations running side by side
- Compare algorithms using the same starting array
- Algorithm statistics such as comparisons and swaps
- Improved visualization and controls
- Deployment as part of my portfolio

## Project Status

Work in progress.

The current implementation supports Bubble Sort and Selection Sort through a reusable backend operation protocol and a shared React playback system.