// import React, {
//   Component,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';
// import { Text, View, StyleSheet } from 'react-native';
// import { Box, Typography } from '~/components/index';
//
// function formatTimeString(time, showMsecs) {
//   // console.log('time: ', time);
//   let msecs = time % 1000;
//
//   if (msecs < 10) {
//     msecs = `00${msecs}`;
//   } else if (msecs < 100) {
//     msecs = `0${msecs}`;
//   }
//
//   let seconds = Math.floor(time / 1000);
//   let minutes = Math.floor(time / 60000);
//   const hours = Math.floor(time / 3600000);
//   seconds -= minutes * 60;
//   minutes -= hours * 60;
//   let formatted;
//   if (showMsecs) {
//     formatted = `${hours < 10 ? 0 : ''}${hours}:${
//       minutes < 10 ? 0 : ''
//     }${minutes}:${seconds < 10 ? 0 : ''}${seconds}:${msecs}`;
//   } else {
//     formatted = `${hours < 10 ? 0 : ''}${hours}:${
//       minutes < 10 ? 0 : ''
//     }${minutes}:${seconds < 10 ? 0 : ''}${seconds}`;
//   }
//
//   return formatted;
// }
//
// interface StopWatchProps {
//   start: boolean;
// }
//
// function useInterval(callback, delay) {
//   const savedCallback = useRef();
//
//   // Remember the latest callback.
//   useEffect(() => {
//     savedCallback.current = callback;
//   }, [callback]);
//
//   // Set up the interval.
//   useEffect(() => {
//     function tick() {
//       savedCallback.current();
//     }
//     if (delay !== null) {
//       const id = setInterval(tick, delay);
//       return () => clearInterval(id);
//     }
//   }, [delay]);
// }
//
// // function useStopWatch<StopWatchProps>(start): { timer: number } {
// //   const intervalRef = useRef<NodeJS.Timer>(null);
// //   const [startTime, setStartTime] = useState<number | Date>(null);
// //   const [state, setState] = useState(true);
// //   const elapsedRef = useRef(0);
// //
// //   useInterval(() => {
// //     setState(!state);
// //   }, 1000);
// //
// //   const doStart = useCallback(() => {
// //     setStartTime(
// //       elapsedRef.current ? new Date() - elapsedRef.current : new Date(),
// //     );
// //
// //     intervalRef.current = intervalRef.current
// //       ? intervalRef.current
// //       : setInterval(() => {
// //           elapsedRef.current = new Date() - startTime;
// //           // setElapsed(new Date() - startTime);
// //         }, 1000);
// //   }, [elapsedRef.current]);
// //
// //   const doStop = useCallback(() => {
// //     if (intervalRef.current) {
// //       clearInterval(intervalRef.current);
// //       intervalRef.current = null;
// //     }
// //   }, [intervalRef.current]);
// //
// //   useEffect(() => {
// //     if (start) {
// //       doStart();
// //     } else {
// //       doStop();
// //     }
// //   }, [start]);
// //
// //   const formatTime = useMemo(() => {
// //     const now = elapsedRef.current;
// //     const formatted = formatTimeString(now, false);
// //
// //     return formatted;
// //   }, [elapsedRef.current]);
// //
// //   return {
// //     timer: elapsedRef.current,
// //   };
// // }
//
// function StopWatch({ start }: StopWatchProps): JSX.Element {
//   const intervalRef = useRef<NodeJS.Timer>(null);
//   const [startTime, setStartTime] = useState<number | Date>(null);
//   const [elapsed, setElapsed] = useState(startTime || 0);
//
//   const doStart = useCallback(() => {
//     setStartTime(elapsed ? new Date() - elapsed : new Date());
//
//     intervalRef.current = intervalRef.current
//       ? intervalRef.currens
//       : setInterval(() => {
//           // elapsedRef.current = new Date() - startTime;
//           setElapsed(new Date() - startTime);
//         }, 1000);
//   }, [elapsed]);
//
//   const doStop = useCallback(() => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//   }, [intervalRef.current]);
//
//   useEffect(() => {
//     if (start) {
//       doStart();
//     } else {
//       doStop();
//     }
//   }, [start]);
//
//   const formatTime = useMemo(() => {
//     const now = elapsed;
//     console.log('now: ', now);
//     const formatted = formatTimeString(now, false);
//
//     return formatted;
//   }, [elapsed]);
//
//   return (
//     <Box>
//       <Typography>{formatTime}</Typography>
//     </Box>
//   );
// }
//
// export default StopWatch;
//
// class StopWatch2 extends Component {
//   constructor(props) {
//     super(props);
//     const { startTime } = props;
//     this.state = {
//       startTime: null,
//       stopTime: null,
//       pausedTime: null,
//       started: false,
//       elapsed: startTime || 0,
//     };
//     this.start = this.start.bind(this);
//     this.stop = this.stop.bind(this);
//     this.reset = this.reset.bind(this);
//     this.formatTime = this.formatTime.bind(this);
//     const width = props.msecs ? 220 : 150;
//     this.defaultStyles = {
//       container: {
//         backgroundColor: '#000',
//         padding: 5,
//         borderRadius: 5,
//         width,
//       },
//       text: {
//         fontSize: 30,
//         color: '#FFF',
//         marginLeft: 7,
//       },
//     };
//   }
//
//   componentDidMount() {
//     if (this.props.start) {
//       this.start();
//     }
//   }
//
//   componentWillReceiveProps(newProps) {
//     if (newProps.start) {
//       this.start();
//     } else {
//       this.stop();
//     }
//     if (newProps.reset) {
//       this.reset();
//     }
//   }
//
//   componentWillUnmount() {
//     clearInterval(this.interval);
//   }
//
//   start() {
//     if (this.props.laps && this.state.elapsed) {
//       const lap = new Date() - this.state.stopTime;
//       this.setState({
//         stopTime: null,
//         pausedTime: this.state.pausedTime + lap,
//       });
//     }
//
//     this.setState({
//       startTime: this.state.elapsed
//         ? new Date() - this.state.elapsed
//         : new Date(),
//       started: true,
//     });
//
//     this.interval = this.interval
//       ? this.interval
//       : setInterval(() => {
//           this.setState({ elapsed: new Date() - this.state.startTime });
//         }, 1);
//   }
//
//   stop() {
//     if (this.interval) {
//       if (this.props.laps) {
//         this.setState({ stopTime: new Date() });
//       }
//
//       clearInterval(this.interval);
//       this.interval = null;
//     }
//     this.setState({ started: false });
//   }
//
//   reset() {
//     const { startTime } = this.props;
//     this.setState({
//       elapsed: startTime || 0,
//       startTime: null,
//       stopTime: null,
//       pausedTime: null,
//     });
//   }
//
//   formatTime() {
//     const { getTime, getMsecs, msecs } = this.props;
//     const now = this.state.elapsed;
//     const formatted = formatTimeString(now, msecs);
//     if (typeof getTime === 'function') {
//       getTime(formatted);
//     }
//     if (typeof getMsecs === 'function') {
//       getMsecs(now);
//     }
//     return formatted;
//   }
//
//   render() {
//     const styles = this.props.options ? this.props.options : this.defaultStyles;
//
//     return (
//       <View ref="stopwatch" style={styles.container}>
//         <Text style={styles.text}>{this.formatTime()}</Text>
//       </View>
//     );
//   }
// }

import React, { Component, createRef } from 'react';
import { formatTimeString } from '~/helpers/formatTimeString';
import { Box, Typography } from '~/components/index';

class StopWatch extends Component {
  constructor(props) {
    super(props);
    const { startTime, ref } = props;
    this.state = {
      startTime: null,
      stopTime: null,
      pausedTime: null,
      started: false,
      elapsed: startTime || 0,
    };
    this.ref = ref;
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
    this.formatTime = this.formatTime.bind(this);
    const width = props.msecs ? 220 : 150;
    this.defaultStyles = {
      container: {
        backgroundColor: '#000',
        padding: 5,
        borderRadius: 5,
        width,
      },
      text: {
        fontSize: 30,
        color: '#FFF',
        marginLeft: 7,
      },
    };
  }

  componentDidMount() {
    if (this.props.start) {
      this.start();
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.start) {
      this.start();
    } else {
      this.stop();
    }
    if (newProps.reset) {
      this.reset();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  start() {
    if (this.props.laps && this.state.elapsed) {
      const lap = new Date() - this.state.stopTime;
      this.setState({
        stopTime: null,
        pausedTime: this.state.pausedTime + lap,
      });
    }

    this.setState({
      startTime: this.state.elapsed
        ? new Date() - this.state.elapsed
        : new Date(),
      started: true,
    });

    this.interval = this.interval
      ? this.interval
      : setInterval(() => {
          this.setState({ elapsed: new Date() - this.state.startTime });
        }, 1000);
  }

  stop() {
    if (this.interval) {
      if (this.props.laps) {
        this.setState({ stopTime: new Date() });
      }

      clearInterval(this.interval);
      this.interval = null;
    }
    this.setState({ started: false });
  }

  reset() {
    const { startTime } = this.props;
    this.setState({
      elapsed: startTime || 0,
      startTime: null,
      stopTime: null,
      pausedTime: null,
    });
  }

  formatTime() {
    const { getTime, getMsecs, msecs } = this.props;
    const now = this.state.elapsed;
    const formatted = formatTimeString(now, msecs);
    if (typeof getTime === 'function') {
      getTime(formatted);
    }
    if (typeof getMsecs === 'function') {
      getMsecs(now);
    }
    return formatted;
  }

  render() {
    return (
      <Box>
        <Typography type="bigger">{this.formatTime()}</Typography>
      </Box>
    );
  }
}

export default StopWatch;
