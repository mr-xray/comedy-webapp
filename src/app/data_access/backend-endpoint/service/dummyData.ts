//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
export const config = {
  events: [
    {
      id: 1,
      name: 'Station Hornbahn II',
      description:
        'Die Station Hornbahn 2 ist einer von 5 Stops auf dem Lift auf der Bichl Alm',
      //type: 'VIDEO',
      type: 'IMAGE',
      triggers: [
        {
          id: 1,
          priority: 64,
          type: 'GPS',
          payload: {
            obscure: false,
            sequence: 1,
            markerIcon:
              'https://cdn.discordapp.com/attachments/545999117214810142/944210492958838794/unknown.png',
            passedMarkerIcon:
              'https://cdn.discordapp.com/attachments/545999117214810142/944210491939627038/unknown.png',
            coordinates: {
              latitude: 46.801571,
              longitude: 15.540631,
            },
            radius: 230000.5,
            direction: 'NORTH',
            description:
              'An diesem Punkt befindet sich die Station Hornbahn II',
          },
        },
        {
          id: 2,
          type: 'GPS',
          priority: 64,
          payload: {
            obscure: true,
            sequence: 1,
            markerIcon: 'not.applicable/because/trigger/is.obscure',
            passedMarkerIcon: 'also.not.applicable',
            coordinates: {
              latitude: 45.801571,
              longitude: 15.540631,
            },
            radius: 25.5,
            direction: 'SOUTH',
            description:
              'An diesem Punkt befindet sich nicht die Station Hornbahn II ok',
          },
        },
        {
          id: 3,
          type: 'MANUAL',
          priority: 128,
          payload: {
            minDuration: 5000,
          },
        },
      ],
      payload: {
        //url: 'https://www.youtube.com/embed/-jhBDFaRFVc',
        url: 'https://cdn.discordapp.com/attachments/545999117214810142/945258236653752400/depositphotos_47349533-stock-photo-labrador-retriever.png',
        //width: 960,
        //height: 540,
        width: '100%',
        height: '100%',
        borderRadius: '1rem',
        //length: 521000,
      },
    },
    {
      id: 2,
      name: 'Station Hornbahn III',
      description:
        'Die Station Hornbahn 3 ist einer von 5 Stops und die Mittelstation auf dem Lift auf der Bichl Alm',
      type: 'MULTIPLE_CHOICE',
      triggers: [
        {
          id: 4,
          type: 'GPS',
          priority: 64,
          payload: {
            obscure: false,
            sequence: 2,
            markerIcon:
              'https://cdn.discordapp.com/attachments/545999117214810142/944210492233248829/unknown.png',
            passedMarkerIcon:
              'https://cdn.discordapp.com/attachments/545999117214810142/944210492535234580/unknown.png',
            coordinates: {
              latitude: 44.801571,
              longitude: 15.540631,
            },
            radius: 2000000.5,
            direction: 'NORTH',
            description:
              'An diesem Punkt befindet sich die Station Hornbahn III',
          },
        },
        {
          id: 5,
          type: 'MANUAL',
          priority: 128,
          payload: {
            minDuration: 10000,
          },
        },
      ],
      payload: {
        question: 'Welche Abfahrten befinden sich im Kitzbühler Schigebiet?',
        answers: [
          {
            answer: 'Achenrainbahn',
            correct: false,
          },
          {
            answer: 'Fleck',
            correct: true,
          },
          {
            answer: 'Hahnenkamm',
            correct: true,
          },
          {
            answer: 'Edelweißbahn',
            correct: false,
          },
        ],
      },
    },
  ],
};
/*
  public event: AppEvent = {
    id: 1, // Damit man die verschiedenen Objekte besser filtern, mappen, etc. kann
    triggers: [
      // Durch welche Trigger kann das Event getriggert werden?
      {
        id: 1,
        type: TriggerType.GPS,
        priority: 64,
        payload: new GpsTriggerPayload(
          false,
          1,
          'https://upload.wikimedia.org/wikipedia/commons/6/69/How_to_use_icon.svg',
          5,
          CompassDirection.EAST,
          'trigger description asdf',
          {
            latitude: 46.801052,
            longitude: 15.539782,
          }
        ),
      },
      {
        id: 3,
        type: TriggerType.GPS,
        priority: 64,
        payload: new GpsTriggerPayload(
          false,
          0,
          'https://upload.wikimedia.org/wikipedia/commons/6/69/How_to_use_icon.svg',
          5,
          CompassDirection.EAST,
          'trigger description asdf',
          {
            latitude: 46.800993,
            longitude: 15.541868,
          }
        ),
      },
      {
        id: 2,
        type: TriggerType.MANUAL,
        priority: 128,
        payload: new ManualTriggerPayload(10000),
      },
    ],
    finish: false,
    name: 'Event 1 gps',
    description: 'Event descirption',
    type: EventIdentifier.MULTIPLE_CHOICE,
    payload: {
      question: 'Question 1??',
      answers: [
        {
          answer: 'answer111',
          correct: true,
        },
        {
          answer: 'answer222',
          correct: false,
        },
        {
          answer: 'answer333',
          correct: false,
        },
        {
          answer: 'answer444',
          correct: true,
        },
      ],
    },
  };*/
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
