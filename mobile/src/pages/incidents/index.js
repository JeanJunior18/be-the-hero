import React, { useEffect, useState} from 'react'
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native'
import { useNavigation} from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'

import api from '../../services/api'

import logoImg from '../../assets/logo.png'

import styles from './styles'

export default function Incidents(){
    


    const navigation = useNavigation()

    function navigateToDetail(incident){
        navigation.navigate('Details', { incident })
    }

    const [incidents, setIncidents] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    async function loadIncidents(){
        if(loading) return;

        if(total>0 && incidents.length===total) return;

        setLoading(true)

        const response = await api.get('/incidents', {
            params: { page }
        })

        setLoading(false)
        setPage(page + 1)
        setIncidents([...incidents, ...response.data])
        setTotal(response.headers['X-Total-Count'])
    }

    useEffect(()=>{
        loadIncidents()
    },[])

    return(
        <View style={styles.container}>

            <View style={styles.header}>
                <Image source={logoImg} alt='logo' />
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{total} casos</Text>
                </Text>
            </View>

            <Text style={styles.title}>Bem Vindo!</Text>
            <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>

            <FlatList 
                style={styles.incidentList}
                data={incidents}
                keyExtractor={incident=>String(incident.id)}
                // showsVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                renderItem={({ item: incident })=>(
                    <View style={styles.incident}>
                    <Text style={styles.incidentProperty}>ONG: </Text>
                    <Text style={styles.incidentValue}>{incident.name}</Text>

                    <Text style={styles.incidentProperty}>CASO: </Text>
                    <Text style={styles.incidentValue}>{incident.title}</Text>
                    
                    <Text style={styles.incidentProperty}>VALUE: </Text>
                    <Text style={styles.incidentValue}>
                        {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(incident.value)}
                    </Text>

                    <TouchableOpacity 
                    style={styles.detailButton} 
                    onPress={()=>navigateToDetail(incident)}
                    >
                        <Text style={styles.detailButtonText}>Ver mais detalhes</Text>
                        <Feather name="arrow-right" size={17} color="#e02041"/>
                    </TouchableOpacity>
                </View>
                )}
            />
            
        </View>
    );
}