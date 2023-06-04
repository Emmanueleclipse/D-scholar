import {
    Box,
    Text,
    Heading,
    Stack,
    useColorModeValue,
    Flex,
} from '@chakra-ui/react';

export default function FeatureCard({ title, content, image }: { title: string, content: string, image:any}) {
    return (


        <Box

            // h="45vh"
            w="300px"
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'2xl'}
            rounded={'md'}
            p={6}
            overflow={'hidden'}>
            <Flex
                h={100}
                mb={6}
                mt={6}
                justifyContent="center">
                    <img src={image} alt="logo" />
            </Flex>
            <Stack height={100}>
                <Stack>
                    <Heading
                        color={useColorModeValue('gray.700', 'white')}
                        fontSize={'l'}
                        fontFamily={'body'}>
                        {title}
                    </Heading>
                    <Text color={'gray.500'} noOfLines={[1, 2]}>
                        {content}
                    </Text>
                </Stack>
            </Stack>
        </Box>


    )
}