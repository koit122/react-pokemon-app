import { useEffect, useState} from "react"
import Type from '@/components/Type.jsx'

export default function DamageRelation({ damages }) {
  const [damagePokemonForm, setDamagePokemonForm] = useState();
  useEffect(() => {
    const arrayDamage = damages.map(damage => separateObjectBetweenToAndFrom(damage));
    if (arrayDamage.length >= 2) {
      const obj = joinDamageRelations(arrayDamage);
      setDamagePokemonForm(resuceDuplicateValues(postDamageValue(obj.from)))
    } else {
      setDamagePokemonForm(postDamageValue(arrayDamage[0].from));
    }
  }, [damages]);
  const joinDamageRelations = (props) => {
    return {
      to: joinObjects(props, "to"),
      from: joinObjects(props, "from"),
    };
  };
  const resuceDuplicateValues = (props) => {
    const duplicateValues = {
      double_damage: "4x",
      half_damage: "1/4x",
      no_damage: "0x",
    };
    return Object.entries(props)
      .reduce((acc, [key, value]) => {
        const verifiedValue = filterForUniqueValues(value, duplicateValues[key])
        return (acc = {
          [key]:verifiedValue,...acc
        })
      }, {})
  }
  const filterForUniqueValues = (valueForFiltering, damageValue) => {
    return valueForFiltering.reduce((acc, currentValue) => {
      const { url, name } = currentValue;
      //console.log(valueForFiltering)
      const fillterACC = acc.filter((a) => a.name !== name)
      return fillterACC.length === acc.length
        ? (acc = [currentValue, ...acc])
        : (acc = [{damageValue: damageValue, name, url},...fillterACC])
    }, [])
  }
  const joinObjects = (props, string) => {
    const key = string;
    const firstArrayValue = props[0][key];
    const secondArrayValue = props[1][key];
    return Object.entries(secondArrayValue).reduce((acc, [key, value]) => {
      const result = firstArrayValue[key].concat(value);
      return (acc = {
        [key]: result,
        ...acc
      });
    }, {});
  };
  const postDamageValue = (props) => {
    const result = Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName;
      const valuesOfKeyName = {
        double_damage: "2x",
        half_damage: "1/2x",
        no_damage: "0x",
      };
      return (acc = {
        [keyName]: value.map((i) => ({
            damageValue: valuesOfKeyName[key],
            ...i,
          })),
        ...acc,
      });
    }, {})
    return result;
  }
  const separateObjectBetweenToAndFrom = (damage) => {
    const from = filterDamageRelations('_from', damage);
    const to = filterDamageRelations('_to', damage);
    return {
      from,
      to
    }
  };
  const filterDamageRelations = (valueFilter, damages) => {
    const result = Object.entries(damages)
      .filter(([keyName]) => {
        return keyName.includes(valueFilter)
      }
      )
      .reduce((acc, [keyName, value]) => {
        const keyWithValueFilterRemove = keyName.replace(valueFilter, ''); 
        return ({ [keyWithValueFilterRemove]: value, ...acc})
      }, {}
      )
    return result;
  }
  return (
    <div className='flex flex-col gap-2'>
      {damagePokemonForm ? (
        <>
          {Object.entries(damagePokemonForm).map(([key, value]) => {
            const valuesOfKeyName = {
              double_damage: 'Weak',
              half_damage: 'Resistant',
              no_damage:'Immune'
            }
            return (
              <div key={key}>
                <h3 className='capitalize font-medium text-sm md:text-base text-slate-500 text-center'>
                  {valuesOfKeyName[key]}
                </h3>
                <div className='flex flex-wrap gap-1 justify-center'>
                  {value.length > 0 ? (
                    value.map(({ name, url, damageValue }) => {
                      return (
                        <Type
                          type={name}
                          key={url}
                          damageValue={damageValue}
                        />  
                      )
                    })
                  ) : (
                      <Type type={'none'} key={'none'}/>
                  )}
                </div>
              </div>
            )
          })}
        </>
      ) : (
          <div></div>
      )}
    </div>
  )
}