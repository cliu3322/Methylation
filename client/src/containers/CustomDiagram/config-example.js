import Task from './task/component';
import taskIcon from './task/icon';
import Event from './event/component';
import eventIcon from './event/icon';

import Trim from './trim/component';
import Align from './align/component';

const config = {
  entityTypes: {
    Task: {
      width: 125,
      height: 75,
    },
    Event: {
      width: 50,
      height: 50,
    },
    Trim: {
      width: 125,
      height: 75,
    },
    Align: {
      width: 125,
      height: 75,
    },
  },
  gridSize: 25,
};

const customEntities = {
  Task: {
    component: Task,
    icon: taskIcon,
  },
  Event: {
    component: Event,
    icon: eventIcon,
  },
  Trim: {
    component: Trim,
    icon: taskIcon,
  },
  Align: {
    component: Trim,
    icon: taskIcon,
  },
};

export { config, customEntities };
