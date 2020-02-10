import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { Calendar } from '@fullcalendar/core';

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
  // const getTime = () => {

  //   let duration = $('#calendar').data().duration.toString() || '60' ;
  //   let time = '';
  //   console.log('duration', duration, typeof(duration))

  //   if(duration.length < 2){
  //     time += `00:${duration}:00`
  //     console.log(time);
  //   }
  //   else if(duration.length >= 3 && duration.length < 4) {
  //     time += `0${duration[0]}:${duration[1]}${duration[2]}:00`
  //     console.log(time);
  //   }
  //   else if (duration.length >= 4) {
  //     time += `${duration[0]}${duration[1]}:${duration[2]}${duration[3]}:00`
  //   }
  // }

  let duration = $('#calendar').data().duration.toString() || '60' ;
  let id = $('#calendar').data().id;
  let time = `00:${duration}:00`;

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
    drop: function(date) {
      date.draggedEl.parentNode.removeChild(date.draggedEl);
      addDate(date.dateStr);
    }
  });
  calendar.render();

  const addDate = (dateStr) => {
    $.post('/event/date', {date: dateStr, id});
  }

});




