/* eslint-disable prettier/prettier */
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

import Header from '../../components/Header';
import Tabs from '../../components/Tabs';
import Menu from '../../components/Menu';

import { Container, Content, Card, CardHeader, CardContent, CardFooter, Annotation, Title, Description } from './styles';

export default function Main() {
    let offset = 0;
    const translateY = new Animated.Value(0);

    const animatedEvent = Animated.event(
        [
            {
                nativeEvent: {
                    translationY: translateY,
                },
            },
        ],
        { useNativeDriver: true },
    );

    function onHandlerStateChange(event) {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            //Si acabo la animación
            let opened = false;
            const { translationY } = event.nativeEvent;

            offset += translationY;

            if (translationY >= 50) {
                opened = true;
            } else {
                translateY.setOffset(0);
                translateY.setValue(offset);
                offset = 0;
            }

            Animated.timing(translateY, {
                toValue: opened ? 380 : 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                offset = opened ? 380 : 0;
                translateY.setOffset(offset);
                translateY.setValue(0);
            });
        }
    }

    return (
        <Container>
            <Header />

            <Content>
                <Menu translateY={translateY} />

                <PanGestureHandler
                    onGestureEvent={animatedEvent}
                    onHandlerStateChange={onHandlerStateChange}
                >
                    <Card
                        style={{
                            transform: [{
                                translateY: translateY.interpolate({
                                    inputRange: [-350, 0, 380],
                                    outputRange: [-50, 0, 380],
                                    extrapolate: 'clamp',
                                }),
                            }],
                        }}
                    >
                        <CardHeader>
                            <Icon name="attach-money" size={28} color="#666" />
                            <Icon name="visibility-off" size={28} color="#666" />
                        </CardHeader>
                        <CardContent>
                            <Title>Saldo disponible</Title>
                            <Description>$255.947,65</Description>
                        </CardContent>
                        <CardFooter>
                            <Annotation>
                                Transferencia de $20,00 recibida por Diego Anriquez hoy 18 hs.
                        </Annotation>
                        </CardFooter>
                    </Card>
                </PanGestureHandler>
            </Content>

            <Tabs translateY={translateY} />
        </Container>
    );
}
