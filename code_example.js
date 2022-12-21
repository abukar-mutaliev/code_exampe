  // функция сортирует участников конференции которые подняли руку,
  // последний поднявший руку перемещается на верх списка. Поднятие и опускание руки приходят с бэка
onlineParticipants() {
  const participants = this.participants.map(item => item)
  const participantsHandUpMap = this.participantsHandUp.reduce((users, current) => {
    if (current.status === 'up') {
      users[current.userId] = current.time;
    }
    return users;
  }, {});
  participants.sort((a, b) => {
    const timeA = participantsHandUpMap[a.user.id] || '';
    const timeB = participantsHandUpMap[b.user.id] || '';
    return timeA < timeB ? 1 : timeA > timeB ? -1 : 1;
  });
  return participants
  .filter(p => p.additional && !p.additional.inQueue)
},
// эта функция записывает на бэк информацию о поднятой руки.
handUp ({state}) {
  return new Promise((resolve, reject) => {
    api
    .post(`conferences/${state.conference.id}/handup`, {status: 'up'})
    .then(response => {
      resolve(response)
    })
    .catch(reject)
  })
},
// здесь вызывается функция поднятие руки и если рука уже поднята, то приходит уведомление об этом
handUpFromMenu(){
  if(this.additional.hand){
    this.$notify({
      group: 'app',
      text: `Вы уже подняли руку!`
    })
  }else{
    this.handUp();
    this.additional.hand = true
    this.localUser.user.hand = {
      up: true,
      date: Date.now()
    }
    const participantFromMenu = {
      additional: this.additional,
      user: this.localUser.user
    }
    this.$root.$pull.subscribe('hand_up', participantFromMenu)
    this.$root.$emit('HAND_UP', participantFromMenu)
  }
},