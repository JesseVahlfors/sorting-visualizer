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

## Local development (Windows / Git Bash)

A django backend is required.

**Backend repository:** [Portfolio](https://github.com/JesseVahlfors/Portfolio_project)

In your django backend working folder `~/Documents/Koodi/Portfolio_project`
activate your virtual environment in the terminal with `source venv/Scripts/activate`

You can check the venv is active by using `python -c "import sys; print(sys.executable)"` in the terminal while in the working folder `~/Documents/Koodi/Portfolio_project`

or you can use vscode to activate the environment.

Check your terminal has (venv) above your working directory. For example:

`(venv)`

`jeza3@Aesir MINGW64 ~/Documents/Koodi/Portfolio_project (sorting-api)`

In vscode you might need to make another terminal for the terminal to have it active.

in the project folder use command `python manage.py runserver` to start the development server.

There should be a confirmation without errors in the terminal:
`Starting development server at http://127.0.0.1:8000/`

In your sorting-visualizer frontend folder.  Use the command `npm run dev` to start the dev frontend.

You should get a success message:
`VITE v8.3.0  ready in 1148 ms ➜  Local:   http://localhost:5173/`
or similar.

Everything should be now ready to use the app.

Use a browser to go to `http://localhost:5173/`.

### Usage steps

Choose a sorting method above the visualization.

Generate Array button makes new random arrays.

Sort button sorts the array and gets instructions for the playback.

When sorting is done Play button is enabled

Use Play button to play or pause the sorting animation.

You can use the speed dropdown menu to adjust speed of the animation

When the sorting animation is complete you can reset the array with Sort button.

The application currently only works with one visualization.

To stop the development servers use `CTRL - C` while in their respective terminals in django and Vite.

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
