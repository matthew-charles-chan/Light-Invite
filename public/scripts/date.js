import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { Calendar } from '@fullcalendar/core';
const moment = require('moment');

$(() =>{
  /* initialize the external events
  -----------------------------------------------------------------*/

  let containerEl = document.getElementById('external-events-list');
  new Draggable(containerEl, {
    itemSelector: '.fc-event',
    eventData: function(eventEl) {
      return {
        title: eventEl.innerText.trim()
      }
    }
  });
  /* initialize the calendar
  -----------------------------------------------------------------*/

  let id = $('#calendar').data().id;
  let duration = $('#calendar').data().duration.toString() || '60' ;
  let time = '';

  if(duration.length <= 2){
    time += `00:${duration}:00`
  }
  else {
    time += `0${duration[0]}:${duration[1]}${duration[2]}:00`
  }

  let calendarEl = document.getElementById('calendar');
  let calendar = new Calendar(calendarEl, {
    plugins: [ interactionPlugin, timeGridPlugin, dayGridPlugin, listPlugin, bootstrapPlugin],
    defaultView: 'timeGridWeek',
    header: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    defaultTimedEventDuration: time,
    forceEventDuration: true,
    themeSystem: 'standard',
    droppable: true, // this allows things to be dropped onto the calendar
    drop: function(day) {
      day.draggedEl.parentNode.removeChild(day.draggedEl);
      addDate(day.dateStr);

    },
    eventAllow: function(info) {
      let date = Date.parse(info.start);
      let current = Date.parse(new Date());
      if(date < current ){
        return false;
      }
      return true;
    }
  });
  const addDate = (dateStr) => {
    $.post('/event/date', {date: dateStr, id: id})
    .done(res => console.log(res))
    .fail(err => console.log(err));
  }
  calendar.render();
});




